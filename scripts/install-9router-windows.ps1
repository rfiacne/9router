<#
.SYNOPSIS
  Install or replace the globally-installed 9router CLI on Windows.

.DESCRIPTION
  This script is intended for a Windows checkout of the 9router repository.
  It can build a fresh `9router-*.tgz` CLI package from the current branch,
  install it globally, backup the previous global package, stop the running
  9router process tree, and restart it with the same `--tray --skip-update`
  flags used by the desktop autostart entry.

  The packaged app is platform-neutral JavaScript; a fresh Windows build is
  still the safest option because npm may install platform-specific CLI/runtime
  dependencies (better-sqlite3, tray helpers) during install/postinstall.

.PARAMETER RepoPath
  Path to the 9router repository root. Defaults to the parent of this scripts
  directory.

.PARAMETER TarballPath
  Path to an existing 9router-*.tgz. If omitted and -BuildFromSource is not
  supplied, the newest 9router-*.tgz in RepoPath is used; if none exists, the
  script builds one from source.

.PARAMETER BuildFromSource
  Force `npm install` + `npm run cli:pack` in RepoPath before installing.

.PARAMETER Port
  HTTP port used by the server. Default: 20128.

.PARAMETER BackupRoot
  Directory for the previous global package backup. Default:
  %APPDATA%\9router\backups

.PARAMETER NoRestart
  Install and backup, but do not start 9router afterwards.

.PARAMETER SkipBackup
  Skip backing up the currently installed global package.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\install-9router-windows.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\install-9router-windows.ps1 `
    -BuildFromSource -Port 20128

.NOTES
  Run this from a normal user PowerShell. If `npm config get prefix` points to
  a protected directory such as C:\Program Files\nodejs, run PowerShell as
  Administrator instead.
#>
[CmdletBinding()]
param(
  [string]$RepoPath = "",
  [string]$TarballPath = "",
  [switch]$BuildFromSource,
  [int]$Port = 20128,
  [string]$BackupRoot = "",
  [switch]$NoRestart,
  [switch]$SkipBackup
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok {
  param([string]$Message)
  Write-Host "  [ok] $Message" -ForegroundColor Green
}

function Write-Warn {
  param([string]$Message)
  Write-Host "  [warn] $Message" -ForegroundColor Yellow
}

function Fail {
  param([string]$Message)
  Write-Host ""
  Write-Host "ERROR: $Message" -ForegroundColor Red
  exit 1
}

function Resolve-RepoPath {
  param([string]$Path)
  if ($Path) {
    $resolved = (Resolve-Path -LiteralPath $Path -ErrorAction Stop).Path
  } else {
    $resolved = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..") -ErrorAction Stop).Path
  }
  return $resolved
}

function Get-CommandPath {
  param(
    [string]$Name,
    [string]$Alternative
  )
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $cmd -and $Alternative) {
    $cmd = Get-Command $Alternative -ErrorAction SilentlyContinue
  }
  if (-not $cmd) {
    Fail "Cannot find '$Name' in PATH."
  }
  return $cmd.Source
}

function Get-GlobalPackageRoot {
  param([string]$NpmExe)
  $root = (& $NpmExe root -g | Select-Object -Last 1)
  if (-not $root) {
    Fail "Could not resolve the global npm root."
  }
  return $root.Trim()
}

function Test-TcpPort {
  param(
    [string]$HostName = "127.0.0.1",
    [int]$PortToTest = 20128,
    [int]$TimeoutMs = 700
  )
  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $iar = $client.BeginConnect($HostName, $PortToTest, $null, $null)
    if (-not $iar.AsyncWaitHandle.WaitOne($TimeoutMs)) {
      return $false
    }
    $client.EndConnect($iar)
    return $true
  } catch {
    return $false
  } finally {
    $client.Close()
  }
}

function Wait-ForPort {
  param(
    [int]$PortToTest = 20128,
    [int]$TimeoutSec = 45
  )
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    if (Test-TcpPort -PortToTest $PortToTest) {
      return $true
    }
    Start-Sleep -Milliseconds 500
  }
  return $false
}

function Get-9RouterProcesses {
  Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -and
      $_.CommandLine -match '(?i)9router[\\/]cli\.js'
    }
}

function Stop-9RouterProcesses {
  $processes = @(Get-9RouterProcesses)
  if ($processes.Count -eq 0) {
    Write-Warn "No running 9router CLI process found."
    return
  }

  foreach ($proc in $processes) {
    Write-Host "  stopping pid $($proc.ProcessId)..." -ForegroundColor DarkGray
    & taskkill.exe /PID $proc.ProcessId /T /F 2>$null | Out-Null
  }

  # The CLI normally kills its own child tree, but if a stray next-server remains,
  # stop every node process whose command line still points at the 9router dir.
  Start-Sleep -Milliseconds 800
  Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" -ErrorAction SilentlyContinue |
    Where-Object {
      $_.CommandLine -and
      $_.CommandLine -match '(?i)9router'
    } |
    ForEach-Object {
      Write-Host "  stopping stray pid $($_.ProcessId)..." -ForegroundColor DarkGray
      & taskkill.exe /PID $_.ProcessId /T /F 2>$null | Out-Null
    }
}

function Backup-GlobalPackage {
  param(
    [string]$Source,
    [string]$DestinationRoot
  )
  if (-not (Test-Path -LiteralPath $Source)) {
    Write-Warn "Global 9router package not found at $Source; nothing to back up."
    return $null
  }

  $version = "unknown"
  $pkgJson = Join-Path $Source "package.json"
  if (Test-Path -LiteralPath $pkgJson) {
    try {
      $version = (Get-Content -LiteralPath $pkgJson -Raw | ConvertFrom-Json).version
    } catch {
      $version = "unknown"
    }
  }

  if (-not (Test-Path -LiteralPath $DestinationRoot)) {
    New-Item -ItemType Directory -Path $DestinationRoot -Force | Out-Null
  }
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $destination = Join-Path $DestinationRoot "9router-global-$version-$stamp"
  New-Item -ItemType Directory -Path $destination -Force | Out-Null

  Write-Host "  backing up $Source -> $destination" -ForegroundColor DarkGray
  & robocopy.exe $Source $destination /E /R:1 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -ge 8) {
    Fail "Backup failed (robocopy exit $LASTEXITCODE)."
  }
  Write-Ok "backup: $destination"
  return $destination
}

function Restore-GlobalPackage {
  param(
    [string]$BackupPath,
    [string]$Destination
  )
  if (-not $BackupPath -or -not (Test-Path -LiteralPath $BackupPath)) {
    Write-Warn "No valid backup to restore."
    return $false
  }
  Write-Step "Restoring previous global package"
  if (Test-Path -LiteralPath $Destination) {
    Remove-Item -LiteralPath $Destination -Recurse -Force
  }
  New-Item -ItemType Directory -Path $Destination -Force | Out-Null
  & robocopy.exe $BackupPath $Destination /E /R:1 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -ge 8) {
    Write-Warn "Restore failed (robocopy exit $LASTEXITCODE)."
    return $false
  }
  Write-Ok "restored $Destination"
  return $true
}

function Build-CliPackage {
  param(
    [string]$Repo,
    [string]$NpmExe
  )
  Write-Step "Installing build dependencies"
  Push-Location $Repo
  try {
    & $NpmExe install "--include=dev" "--ignore-scripts" "--no-audit" "--no-fund"
    if ($LASTEXITCODE -ne 0) {
      throw "Root npm install failed with exit code $LASTEXITCODE."
    }

    & $NpmExe install --prefix cli "--include=dev" "--ignore-scripts" "--no-audit" "--no-fund"
    if ($LASTEXITCODE -ne 0) {
      throw "CLI npm install failed with exit code $LASTEXITCODE."
    }

    Write-Step "Building 9router CLI package (npm run cli:pack)"
    & $NpmExe run cli:pack
    if ($LASTEXITCODE -ne 0) {
      throw "npm run cli:pack failed with exit code $LASTEXITCODE."
    }
  } finally {
    Pop-Location
  }
}

function Find-LatestTarball {
  param([string]$Repo)
  $tarball = Get-ChildItem -LiteralPath $Repo -Filter "9router-*.tgz" -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
  if ($tarball) {
    return $tarball.FullName
  }
  return ""
}

function Start-9Router {
  param(
    [string]$NodeExe,
    [string]$CliJs,
    [int]$ServerPort
  )

  if (-not (Test-Path -LiteralPath $CliJs)) {
    Fail "9router CLI not found at $CliJs."
  }

  $argLine = '"' + $CliJs + '" --tray --skip-update'
  if ($ServerPort -ne 20128) {
    $argLine += " --port $ServerPort"
  }

  Write-Step "Starting 9router"
  Write-Host "  $NodeExe $argLine" -ForegroundColor DarkGray
  Start-Process -FilePath $NodeExe `
    -ArgumentList $argLine `
    -WorkingDirectory $env:USERPROFILE `
    -WindowStyle Hidden | Out-Null

  if (-not (Wait-ForPort -PortToTest $ServerPort -TimeoutSec 45)) {
    return $false
  }
  Write-Ok "9router is listening on 127.0.0.1:$ServerPort"
  return $true
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

$repo = Resolve-RepoPath -Path $RepoPath
$nodeExe = Get-CommandPath -Name "node.exe" -Alternative "node"
$npmExe = Get-CommandPath -Name "npm.cmd" -Alternative "npm"

if (-not $BackupRoot) {
  $appData = if ($env:APPDATA) { $env:APPDATA } else { Join-Path $env:USERPROFILE "AppData\Roaming" }
  $BackupRoot = Join-Path $appData "9router\backups"
}

Write-Step "Environment"
Write-Host "  repo:        $repo"
Write-Host "  node:        $nodeExe"
Write-Host "  npm:         $npmExe"
Write-Host "  port:        $Port"
Write-Host "  backup root: $BackupRoot"

$globalRoot = Get-GlobalPackageRoot -NpmExe $npmExe
$globalPkg = Join-Path $globalRoot "9router"
$cliJs = Join-Path $globalPkg "cli.js"

if (-not (Test-Path -LiteralPath $globalPkg)) {
  Fail "Global 9router package not found at $globalPkg. Install it once with: npm install -g 9router"
}

if (-not $TarballPath) {
  if ($BuildFromSource) {
    Build-CliPackage -Repo $repo -NpmExe $npmExe
  } else {
    $TarballPath = Find-LatestTarball -Repo $repo
    if (-not $TarballPath) {
      Write-Warn "No 9router-*.tgz found in $repo; building from source."
      Build-CliPackage -Repo $repo -NpmExe $npmExe
    }
  }
}

if (-not $TarballPath) {
  $TarballPath = Find-LatestTarball -Repo $repo
}
if (-not $TarballPath -or -not (Test-Path -LiteralPath $TarballPath)) {
  Fail "No tarball to install. Pass -TarballPath <path> or -BuildFromSource."
}
$TarballPath = (Resolve-Path -LiteralPath $TarballPath).Path
Write-Ok "tarball: $TarballPath"

$backupPath = $null
if (-not $SkipBackup) {
  Write-Step "Backing up current global package"
  $backupPath = Backup-GlobalPackage -Source $globalPkg -DestinationRoot $BackupRoot
} else {
  Write-Warn "Skipping backup (-SkipBackup)."
}

$hadRunningServer = @(Get-9RouterProcesses).Count -gt 0
if ($hadRunningServer) {
  Write-Step "Stopping running 9router"
  Stop-9RouterProcesses
} else {
  Write-Warn "9router was not running."
}

# Wait for the old process to release the port so npm can replace files.
$portDeadline = (Get-Date).AddSeconds(15)
while ((Test-TcpPort -PortToTest $Port) -and ((Get-Date) -lt $portDeadline)) {
  Start-Sleep -Milliseconds 300
}
if (Test-TcpPort -PortToTest $Port) {
  Fail "Port $Port is still in use after stopping 9router."
}

try {
  Write-Step "Installing global package"
  & $npmExe install -g $TarballPath "--no-audit" "--no-fund"
  if ($LASTEXITCODE -ne 0) {
    throw "npm install -g failed with exit code $LASTEXITCODE."
  }

  # npm 11+/12 may block global postinstall scripts. The hook is best-effort and
  # idempotent, so run it explicitly to warm platform-specific runtime deps.
  if (Test-Path -LiteralPath (Join-Path $globalPkg "hooks\postinstall.js")) {
    Write-Step "Running postinstall hook"
    Push-Location $globalPkg
    try {
      & $nodeExe "hooks\postinstall.js"
      if ($LASTEXITCODE -ne 0) {
        Write-Warn "postinstall hook returned exit code $LASTEXITCODE; cli.js will retry at runtime."
      } else {
        Write-Ok "postinstall hook completed"
      }
    } finally {
      Pop-Location
    }
  }

  if (-not (Test-Path -LiteralPath $cliJs)) {
    throw "Installed package does not contain $cliJs."
  }

  if ($NoRestart) {
    Write-Warn "Skipping restart (-NoRestart). Start it manually with:"
    Write-Host "  `"$nodeExe`" `"$cliJs`" --tray --skip-update" -ForegroundColor DarkGray
    Write-Ok "Install complete."
    exit 0
  }

  $started = Start-9Router -NodeExe $nodeExe -CliJs $cliJs -ServerPort $Port
  if (-not $started) {
    throw "The new 9router process did not start listening on port $Port."
  }

  Write-Host ""
  Write-Host "9router replacement complete." -ForegroundColor Green
  Write-Host "  version: $((Get-Content -LiteralPath (Join-Path $globalPkg 'package.json') -Raw | ConvertFrom-Json).version)"
  Write-Host "  package: $globalPkg"
  if ($backupPath) {
    Write-Host "  backup:  $backupPath"
  }
  Write-Host ""
  Write-Host "If anything looks wrong, stop 9router, restore the backup directory above," -ForegroundColor Yellow
  Write-Host "and start again with:" -ForegroundColor Yellow
  Write-Host "  `"$nodeExe`" `"$cliJs`" --tray --skip-update" -ForegroundColor DarkGray
} catch {
  Write-Host ""
  Write-Warn "Install/restart failed: $($_.Exception.Message)"
  Stop-9RouterProcesses
  if (-not $SkipBackup -and $backupPath) {
    Restore-GlobalPackage -BackupPath $backupPath -Destination $globalPkg | Out-Null
    if ($hadRunningServer -and -not $NoRestart) {
      Write-Step "Restarting previous 9router"
      Start-9Router -NodeExe $nodeExe -CliJs $cliJs -ServerPort $Port | Out-Null
    }
  }
  Fail "Replacement failed; previous package restored if a backup was available."
}
