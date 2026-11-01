$log = Join-Path $PSScriptRoot 'disable-tasks.log'
$tasks = @('App Explorer','AcerJumpstartTask','JumpstartRuntimeTask','UEIPInvitation','Software Update Application')
$out = @()
foreach ($t in $tasks) {
    $task = Get-ScheduledTask -TaskName $t -ErrorAction SilentlyContinue
    if ($task) {
        try {
            Disable-ScheduledTask -TaskName $t -TaskPath $task.TaskPath -ErrorAction Stop | Out-Null
            $state = (Get-ScheduledTask -TaskName $t -TaskPath $task.TaskPath).State
            $out += "DISABLED`t$t`t$($task.TaskPath)`t$state"
        } catch {
            $out += "FAILED`t$t`t$($task.TaskPath)`t$($_.Exception.Message)"
        }
    } else {
        $out += "NOTFOUND`t$t"
    }
}
$out | Set-Content -Path $log -Encoding UTF8
