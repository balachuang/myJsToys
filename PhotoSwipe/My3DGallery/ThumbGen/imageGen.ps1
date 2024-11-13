$SourceDir = '..\ImageFull'
$ImageTypes = @(
	'.png'
)

Add-Type -AssemblyName 'System.Drawing'

$FileList = Get-ChildItem -LiteralPath $SourceDir -File |
	Where-Object {
		$_.Extension -in $ImageTypes
	}

foreach ($FL_Item in $FileList)
{
	try
	{
		$CurImage = [System.Drawing.Bitmap]::new($FL_Item.FullName)
		[PSCustomObject]@{
			FullFileName = $FL_Item.Basename
			Wide = "`t"+$CurImage.Width
			High = "`t"+$CurImage.Height
		}
	}
	catch
	{
		Write-Warning ('	file named = {0}' -f $FL_Item.FullName)
		Write-Warning ('	error {0}' -f $_)
	}
}
