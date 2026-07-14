$dir = "c:\Users\manes\OneDrive\Club-Website\assets\Dengiya"

$mappings = @{
    "cover.jpeg.heif" = "cover.jpeg"
    "img01.jpeg.jpg"  = "img01.jpeg"
    "img02.jpeg.heif" = "img02.jpeg"
    "img03.jpeg.heif" = "img03.jpeg"
    "img04.jpeg.heif" = "img04.jpeg"
}

foreach ($oldName in $mappings.Keys) {
    $newName = $mappings[$oldName]
    $oldPath = Join-Path $dir $oldName
    $newPath = Join-Path $dir $newName
    if (Test-Path $oldPath) {
        if (Test-Path $newPath) {
            Remove-Item $newPath -Force
        }
        Rename-Item $oldPath $newName -Force
        Write-Host "Renamed $oldName to $newName"
    } else {
        Write-Host "File not found: $oldName"
    }
}
