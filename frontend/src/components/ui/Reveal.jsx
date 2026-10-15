import { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, className = '', delay = 0, direction = 'bottom' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsVisible(true);
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setIsVisible(true);
            return;
        }

        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const directionClass =
        direction === 'left'
            ? 'reveal-left'
            : direction === 'right'
                ? 'reveal-right'
                : 'reveal-bottom';

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? 'reveal-visible' : directionClass}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default Reveal;
