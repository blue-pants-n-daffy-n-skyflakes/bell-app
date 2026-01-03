// 1. Create the synth ONCE at the top level
const synth = new Tone.Synth().toDestination();

let lastX, lastY, lastZ;
let threshold = 20; // Increased for a "real" shake
let lastShakeTime = 0; // Prevent rapid-fire sounds

function handleMotion(event) {
  let { x, y, z } = event.acceleration; 
  
  if (!x || !lastX) {
    lastX = x; lastY = y; lastZ = z;
    return;
  }

  // Calculate change in motion (Delta)
  let delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);

  if (delta > threshold) {
    onShakeDetected();
  }

  lastX = x; lastY = y; lastZ = z;
}

function onShakeDetected() {
  const now = Date.now();
  // 2. Debounce: Only play once every 500ms
  if (now - lastShakeTime > 500) {
    console.log("Shake confirmed!");
    playTing();
    lastShakeTime = now;
  }
}

function playTing() {
  // 3. Use Tone.now() for accurate scheduling
  synth.triggerAttackRelease("C4", "8n", Tone.now());
}

async function initShakeSound() {    
    // Unlock Audio
    await Tone.start();
    
    // Request Motion Permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      const response = await DeviceMotionEvent.requestPermission();
      if (response === 'granted') {
        window.addEventListener('devicemotion', handleMotion);
        document.getElementById('btn-start').style.display = 'none'; 
      }
    } else {
      window.addEventListener('devicemotion', handleMotion);
      document.getElementById('btn-start').style.display = 'none'; 
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-start').addEventListener('click', initShakeSound);
    document.getElementById('btn-ting').addEventListener('click', playTing);
});
