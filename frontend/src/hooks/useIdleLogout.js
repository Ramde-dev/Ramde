import { useEffect, useRef } from 'react';

/**
 * Custom hook that logs out the user after a period of inactivity.
 * 
 * @param {Function} onIdle - Callback function invoked when the user is idle
 * @param {number} timeout - Idle timeout in milliseconds (default: 30000 = 30 seconds)
 * 
 * @example
 * useIdleLogout(() => logout(), 30000);
 */
export function useIdleLogout(onIdle, timeout = 30000) {
    const timerRef = useRef(null);

    useEffect(() => {
        const resetTimer = () => {
            // Clear existing timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Set new timer
            timerRef.current = setTimeout(() => {
                onIdle();
            }, timeout);
        };

        // Events that count as user activity
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click',
            'keydown',
        ];

        // Start initial timer
        resetTimer();

        // Listen to all activity events
        events.forEach((event) => {
            document.addEventListener(event, resetTimer, true);
        });

        // Cleanup on unmount
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach((event) => {
                document.removeEventListener(event, resetTimer, true);
            });
        };
    }, [onIdle, timeout]);
}