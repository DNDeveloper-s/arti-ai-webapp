import { useEffect, type RefObject } from 'react'

type EventType = 'mousedown' | 'mouseup' | 'touchstart' | 'touchend'

/**
 * Custom hook for handling clicks outside a specified element.
 * @template T - The type of the element's reference.
 * @param {RefObject<T> | RefObject<T>[]} ref - The React ref object(s) representing the element(s) to watch for outside clicks.
 * @param {(event: MouseEvent | TouchEvent) => void} handler - The callback function to be executed when a click outside the element occurs.
 * @param {EventType} [eventType] - The mouse event type to listen for (optional, default is 'mousedown').
 * @returns {void}
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-on-click-outside)
 * @example
 * const containerRef = useRef(null);
 * useOnClickOutside([containerRef], () => {
 *   // Handle clicks outside the container.
 * });
 */
export function useClickAway<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  eventType: EventType = 'mousedown',
): void {

    useEffect(() => {
        function listener(event: MouseEvent | TouchEvent) {
            if(!Array.isArray(ref) && !ref?.current) return;

            const target = event.target as Node

            // Do nothing if the target is not connected element with document
            if (!target || !target.isConnected) {
            return
            }
        
            const isOutside = Array.isArray(ref)
            ? ref.every(r => r.current && !r.current.contains(target))
            : ref.current && !ref.current.contains(target)
        
            if (isOutside) {
                handler(event)
            }
        };

        const events = Array.isArray(eventType) ? eventType : [eventType]
        events.forEach(eventType => {
            document.addEventListener(eventType, listener)
        })

        return () => {
            events.forEach(eventType => {
                document.removeEventListener(eventType, listener)
            })
        }
    }, [ref, handler, eventType])
}