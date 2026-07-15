'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [visible, setVisible] = useState(false);
    const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'magnetic' | 'view'>('default');
    const [isMobile, setIsMobile] = useState(true);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 32, stiffness: 280, mass: 0.6 };
    const cursorSpringX = useSpring(cursorX, springConfig);
    const cursorSpringY = useSpring(cursorY, springConfig);

    const cursorSize = useMotionValue(20);
    const cursorSpringSize = useSpring(cursorSize, { damping: 25, stiffness: 200 });

    const scaleX = useMotionValue(1);
    const scaleY = useMotionValue(1);
    const scaleSpringX = useSpring(scaleX, { damping: 25, stiffness: 180 });
    const scaleSpringY = useSpring(scaleY, { damping: 25, stiffness: 180 });

    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const lastTime = useRef(Date.now());

    useEffect(() => {
        const checkMobile = () => {
            const hasTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
            setIsMobile(hasTouch);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const onMouseMove = (e: MouseEvent) => {
            setVisible(true);

            // Compute mouse movement speed to calculate stretch distortion
            const now = Date.now();
            const dt = now - lastTime.current || 1;
            const dx = e.clientX - lastMouseX.current;
            const dy = e.clientY - lastMouseY.current;
            const speed = Math.sqrt(dx * dx + dy * dy) / dt;

            lastMouseX.current = e.clientX;
            lastMouseY.current = e.clientY;
            lastTime.current = now;

            // Check if hovering interactive attributes
            const target = e.target as HTMLElement;
            const interactive = target.closest('[data-cursor]');

            if (interactive) {
                const type = interactive.getAttribute('data-cursor') as any;
                setCursorType(type || 'pointer');

                if (type === 'magnetic') {
                    // Pull coordinates towards the center of the hovered element
                    const rect = interactive.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    // Mix 60% button center and 40% mouse position
                    cursorX.set(centerX + (e.clientX - centerX) * 0.42);
                    cursorY.set(centerY + (e.clientY - centerY) * 0.42);
                    cursorSize.set(rect.width + 12);
                    scaleX.set(1.0);
                    scaleY.set(1.0);
                } else if (type === 'view') {
                    cursorX.set(e.clientX);
                    cursorY.set(e.clientY);
                    cursorSize.set(65);
                    scaleX.set(1.0);
                    scaleY.set(1.0);
                } else {
                    // Default pointer expand
                    cursorX.set(e.clientX);
                    cursorY.set(e.clientY);
                    cursorSize.set(40);
                    scaleX.set(1.0);
                    scaleY.set(1.0);
                }
            } else {
                setCursorType('default');
                cursorX.set(e.clientX);
                cursorY.set(e.clientY);
                cursorSize.set(18);

                // Stretch along translation speed vector
                const stretch = Math.min(1.42, 1.0 + speed * 0.08);
                const squeeze = Math.max(0.68, 1.0 - speed * 0.06);

                scaleX.set(dx > dy ? stretch : squeeze);
                scaleY.set(dy > dx ? stretch : squeeze);
            }
        };

        const onMouseLeave = () => {
            setVisible(false);
        };

        window.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [isMobile, cursorX, cursorY, scaleX, scaleY, cursorSize]);

    if (isMobile || !visible) return null;

    return (
        <motion.div
            style={{
                x: cursorSpringX,
                y: cursorSpringY,
                translateX: '-50%',
                translateY: '-50%',
                width: cursorSpringSize,
                height: cursorSpringSize,
                scaleX: scaleSpringX,
                scaleY: scaleSpringY,
            }}
            className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-gold/45 flex items-center justify-center transition-colors duration-300 ${
                cursorType === 'magnetic' 
                    ? 'bg-transparent border-gold' 
                    : cursorType === 'view'
                    ? 'bg-gold border-none text-black font-extrabold text-[9px] uppercase tracking-[0.2em] font-sans'
                    : 'bg-white/5'
            }`}
        >
            {cursorType === 'view' && <span>View</span>}
            {cursorType === 'pointer' && (
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            )}
        </motion.div>
    );
}
