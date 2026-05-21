Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\manes\OneDrive\Club-Website\assets\members\Manal.png")
$bmp = New-Object System.Drawing.Bitmap($img)
$color = $bmp.GetPixel(0,0)
Write-Host "$($color.R),$($color.G),$($color.B)"
