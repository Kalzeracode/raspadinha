import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ScratchableCardProps {
    prize: string;
}

const ScratchableCard: React.FC<ScratchableCardProps> = ({ prize }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isRevealedRef = useRef(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

    const cardWidth = 200;
    const cardHeight = 150;
    const revealThreshold = 0.7; // 70%

    const getCoordinates = (event: MouseEvent | TouchEvent): { x: number, y: number } | null => {
        if (!canvasRef.current) return null;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        let clientX, clientY;
        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else if (event.touches && event.touches[0]) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            return null;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    const checkReveal = useCallback(() => {
        if (!canvasRef.current || isRevealedRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
    
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let transparentPixels = 0;
    
        // Only check the alpha channel (every 4th byte)
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 128) { // Consider semi-transparent pixels as revealed
                transparentPixels++;
            }
        }
    
        const totalPixels = data.length / 4;
        const revealPercentage = transparentPixels / totalPixels;
    
        if (revealPercentage > revealThreshold) {
            isRevealedRef.current = true;
            setIsRevealed(true);
            
            // Animate clearing the rest of the overlay
            let alpha = 1.0;
            const clearAnimation = () => {
                if (alpha <= 0) return;
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                alpha -= 0.1;
                requestAnimationFrame(clearAnimation);
            }
            setTimeout(clearAnimation, 100); // Start clearing after glow begins
        }
    }, []);
    

    const scratch = useCallback((x: number, y: number) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.globalCompositeOperation = 'destination-out';
        
        // Use a radial gradient for a softer, more realistic brush
        const brush = ctx.createRadialGradient(x, y, 15, x, y, 25);
        brush.addColorStop(0, 'rgba(0, 0, 0, 1)'); // Center is fully erased
        brush.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
        brush.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Edge is not erased

        ctx.fillStyle = brush;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    const startDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        event.preventDefault();
        if (isRevealedRef.current) return;
        setIsDrawing(true);
        const coords = getCoordinates(event.nativeEvent);
        if (coords) {
            scratch(coords.x, coords.y);
        }
    }, [scratch]);

    const stopDrawing = useCallback(() => {
        if (isDrawing) {
            setIsDrawing(false);
            checkReveal();
        }
    }, [isDrawing, checkReveal]);
    
    const handleDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || isRevealedRef.current) return;
        event.preventDefault();
        const coords = getCoordinates(event.nativeEvent);
        if (coords) {
            scratch(coords.x, coords.y);
        }
    }, [isDrawing, scratch]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = cardWidth;
        canvas.height = cardHeight;
        
        // --- Draw Bottom Layer (Prize) ---
        const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#ec4899');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cardWidth, cardHeight);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prize, cardWidth / 2, cardHeight / 2);

        // --- Draw Top Layer (Scratchable overlay) ---
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 0, cardWidth, cardHeight);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 16px sans-serif';
        ctx.fillText('Raspe Aqui!', cardWidth / 2, cardHeight / 2);

    }, [prize]);

    return (
        <div className={`aspect-[4/3] w-full bg-slate-700 rounded-lg overflow-hidden shadow-md cursor-grab active:cursor-grabbing relative ${isRevealed ? 'animate-reveal-glow' : ''}`}>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={handleDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
                onTouchMove={handleDrawing}
                style={{ width: '100%', height: '100%', touchAction: 'none' }}
                aria-label={`Raspadinha com prêmio oculto. Raspe para revelar.`}
            />
        </div>
    );
};

export default ScratchableCard;