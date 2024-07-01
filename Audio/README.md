# Web Audio Tech

## Reference
- https://www.zhangxinxu.com/wordpress/2017/06/html5-web-audio-api-js-ux-voice/
- https://www.oxxostudio.tw/articles/201509/web-audio-api.html
- https://benzleung.gitbooks.io/web-audio-api-mini-guide/content/chapter3-2-4.html

## Quick Introduction
| Code Snippet                                                                 | Introduction                                                                  |
|------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| var oscillator = audioCtx.createOscillator();                                | 建立一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调      |
| var gainNode = audioCtx.createGain();                                        | 建立一个GainNode,它可以控制音訊的总音量                                          |
| oscillator.connect(gainNode);                                                | 把音量，音调和终节点进行关联                                                     |
| gainNode.connect(audioCtx.destination);                                      | 把 gainNode 連到音訊輸出设备                                                    |
| oscillator.type = 'sine';                                                    | 指定音调的类型，其他还有square|triangle|sawtooth                                 |
| oscillator.frequency.value = ;                                               | 设置当前播放声音的频率，也就是最终播放声音的调调                                   |
| gainNode.gain.setValueAtTime(0, audioCtx.currentTime);                       | 当前时间设置音量为0                                                             |
| gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);     | 0.01秒后音量为1                                                                |
| oscillator.start(audioCtx.currentTime);                                      | 音调从当前时间开始播放                                                          |
| gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1); | 1 秒内声音慢慢降低                                                             |
| oscillator.stop(audioCtx.currentTime + 1);                                   | 1 秒后完全停止声音                                                              |
|------------------------------------------------------------------------------|-------------------------------------------------------------------------------|

##	audioNodes
1. OscillatorNode : 振盪產生器
1. GainNode : 音量調整
1. CompressorNode : 混音器 (同時發多個聲音時需要, 直接把 GainNode 連到 Destination 會出現爆音)
1. destination : 輸出設備
