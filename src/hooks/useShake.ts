import { useEffect, useRef, useCallback } from 'react';

const SHAKE_THRESHOLD = 15;
const SHAKE_TIMEOUT = 1000;

export function useShake(onShake: () => void, enabled: boolean = true) {
  const lastShake = useRef(0);
  const lastAccel = useRef({ x: 0, y: 0, z: 0 });
  const permissionGranted = useRef(false);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      if (!enabled) return;

      const accel = event.accelerationIncludingGravity;
      if (!accel || accel.x === null || accel.y === null || accel.z === null) return;

      const deltaX = Math.abs(accel.x - lastAccel.current.x);
      const deltaY = Math.abs(accel.y - lastAccel.current.y);
      const deltaZ = Math.abs(accel.z - lastAccel.current.z);

      lastAccel.current = { x: accel.x, y: accel.y, z: accel.z };

      if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
        const now = Date.now();
        if (now - lastShake.current > SHAKE_TIMEOUT) {
          lastShake.current = now;
          onShake();
        }
      }
    },
    [onShake, enabled]
  );

  const requestPermission = useCallback(async () => {
    if (permissionGranted.current) return true;

    const DME = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DME.requestPermission === 'function') {
      try {
        const result = await DME.requestPermission();
        permissionGranted.current = result === 'granted';
        return result === 'granted';
      } catch {
        return false;
      }
    }

    permissionGranted.current = true;
    return true;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [handleMotion, enabled]);

  return { requestPermission };
}
