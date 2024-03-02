# 如何匯入 Google Map 3D 地圖

## 步驟
1. 下載 RenderDoc: https://renderdoc.org/builds
2. 下載 MapsModelsImporter: https://github.com/eliemichel/MapsModelsImporter/releases
3. 關閉所有 Chrome (含 Line), 再用命令列重啟 Chrome 並記錄 PID:
	```
	C:\Windows\System32\cmd.exe /c "SET RENDERDOC_HOOK_EGL=0 && START "" ^"C:\Program Files\Google\Chrome\Application\chrome.exe^" --disable-gpu-sandbox --gpu-startup-dialog"
	```
4. 啟動 RednerDoc >> Inject Process >> 輸入 PID >> Inject
5.  關掉 PID, 進入 Chrome, 確定右上角有黑字, 進入 Google Map, 切換到 3D view, 範圍不要太大.
6. RenderDoc 按 Capture, 再到 Google Map 動一下.
7. 在 Capture 結果上按右鍵存檔 *.rdc
8. Blender 安裝 GoogleMapImpoerter addon
9. Import *.rdc

## 參考:
- Youtube 教學: https://www.youtube.com/watch?v=9zfcEAVD8Wo&list=PLovMXCmjihFgj59DMKY792DhIrugawUa3&index=4&t=587s
- MapsModelsImporter 首頁: https://github.com/eliemichel/MapsModelsImporter
- RenderDoc 首頁: https://renderdoc.org/


- why not import all mesh ???

## Wait for Delete:
C:\Program Files\Google\Chrome\Application\chrome.exe
**Chrome的目標(T)要更改的內容：
C:\Windows\System32\cmd.exe /c "SET RENDERDOC_HOOK_EGL=0 && START "" ^"C:\Program Files\Google\Chrome\Application\chrome.exe^" --disable-gpu-sandbox --gpu-startup-dialog"
https://github.com/eliemichel/MapsModelsImporter
要記得關 Line !!!
