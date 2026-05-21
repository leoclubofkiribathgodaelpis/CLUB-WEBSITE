Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\manes\OneDrive\Club-Website\assets\members"
Get-ChildItem $dir -Filter *.* | ForEach-Object {
    if ($_.Extension -match "\.(png|jpg|jpeg)") {
        try {
            $img = [System.Drawing.Image]::FromFile($_.FullName)
            $bmp = New-Object System.Drawing.Bitmap($img)
            $color = $bmp.GetPixel(0,0)
            $hex = "#{0:x2}{1:x2}{2:x2}" -f $color.R, $color.G, $color.B
            Write-Host "$($_.Name) - $hex"
            $img.Dispose()
            $bmp.Dispose()
        } catch {
            Write-Host "Error processing $($_.Name): $_"
        }
    }
}
