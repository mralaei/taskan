import React, { useMemo, useRef, useState } from 'react';
import { Project, TaskStatus } from '../types';

interface TimelineViewProps {
    project: Project;
    isPublic?: boolean;
}

const statusColors: { [key in TaskStatus]: string } = {
    pending: 'bg-gray-400',
    'in-progress': 'bg-blue-500',
    completed: 'bg-green-500',
};

const TimelineView: React.FC<TimelineViewProps> = ({ project, isPublic = false }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });
    const [scale, setScale] = useState(1);
    const initialPinchDistance = useRef(0);

    const { timeScale, gridLabels, tasksByPeriod } = useMemo(() => {
        const allTasks = project.periods.flatMap(p => p.tasks.map(t => ({...t, periodTitle: p.title }))).filter(t => t.due_date);
        
        if (allTasks.length === 0) {
             const now = new Date();
             const start = new Date(now.getFullYear(), now.getMonth() -1, 1);
             const end = new Date(now.getFullYear(), now.getMonth() + 2, 1);
             return {
                timeScale: { start, end, totalDays: (end.getTime() - start.getTime()) / (1000 * 3600 * 24) },
                gridLabels: [start, new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth()+1, 1)],
                tasksByPeriod: project.periods.sort((a,b) => a.position - b.position).map(p => ({...p, tasks: []}))
             }
        }
        
        const allDates = allTasks.map(t => new Date(t.due_date!));
        const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
        
        minDate.setDate(1);
        maxDate.setMonth(maxDate.getMonth() + 1, 1);

        const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24);

        const labels: Date[] = [];
        let currentDate = new Date(minDate);
        while (currentDate < maxDate) {
            labels.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        const groupedTasks = project.periods.sort((a,b) => a.position - b.position).map(period => ({
            ...period,
            tasks: period.tasks.filter(t => t.due_date).sort((a,b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
        }));

        return {
            timeScale: { start: minDate, end: maxDate, totalDays },
            gridLabels: labels,
            tasksByPeriod: groupedTasks
        };
    }, [project]);

    const timelineContentWidth = useMemo(() => {
        const months = gridLabels.length > 1 ? gridLabels.length : 3;
        const baseWidth = Math.max(months * 300, 1200);
        return baseWidth * scale;
    }, [gridLabels, scale]);


    const getTaskLeftPercent = (taskDateStr: string | undefined): number => {
        if (!taskDateStr || timeScale.totalDays <= 0) return 0;
        const taskDate = new Date(taskDateStr);
        const daysFromStart = (taskDate.getTime() - timeScale.start.getTime()) / (1000 * 3600 * 24);
        return (daysFromStart / timeScale.totalDays) * 100;
    };
    
    const startPan = (clientX: number, clientY: number) => {
        if (scrollContainerRef.current) {
            setIsPanning(true);
            setStartPos({ x: clientX, y: clientY });
            setScrollPos({ 
                left: scrollContainerRef.current.scrollLeft,
                top: scrollContainerRef.current.scrollTop
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('.group')) return;
        e.preventDefault();
        startPan(e.pageX, e.pageY);
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPanning || !scrollContainerRef.current) return;
        e.preventDefault();
        const dx = e.pageX - startPos.x;
        const dy = e.pageY - startPos.y;
        scrollContainerRef.current.scrollLeft = scrollPos.left - dx;
        scrollContainerRef.current.scrollTop = scrollPos.top - dy;
    };

    const stopPan = () => {
        setIsPanning(false);
    };

    const getPinchDistance = (touches: React.TouchList) => {
        return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2) {
            initialPinchDistance.current = getPinchDistance(e.touches);
        } else if (e.touches.length === 1) {
            startPan(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2 && initialPinchDistance.current > 0) {
            const newDist = getPinchDistance(e.touches);
            const newScale = scale * (newDist / initialPinchDistance.current);
            setScale(Math.max(0.5, Math.min(newScale, 3))); // Clamp scale between 0.5x and 3x
            initialPinchDistance.current = newDist;
        } else if (e.touches.length === 1 && isPanning && scrollContainerRef.current) {
            const dx = e.touches[0].clientX - startPos.x;
            const dy = e.touches[0].clientY - startPos.y;
            scrollContainerRef.current.scrollLeft = scrollPos.left - dx;
            scrollContainerRef.current.scrollTop = scrollPos.top - dy;
        }
    };

    const handleTouchEnd = () => {
        stopPan();
        initialPinchDistance.current = 0;
    };


    return (
        <div 
            ref={scrollContainerRef}
            className={`p-4 sm:p-8 h-full overflow-auto text-light-text dark:text-dark-text ${isPanning ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            style={{ touchAction: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseUp={stopPan}
            onMouseLeave={stopPan}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
             <div className="relative pt-10" style={{ minWidth: `${timelineContentWidth}px` }}>
                {/* Timeline Header */}
                <div className="relative flex border-b-2 border-light-border dark:border-dark-border pb-2 text-sm text-light-muted-text dark:text-dark-muted-text pointer-events-none">
                    {gridLabels.map((label, index) => (
                        <div key={index} style={{ width: `${timelineContentWidth / (gridLabels.length || 1)}px` }} className="text-center flex-shrink-0">
                            {label.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })}
                        </div>
                    ))}
                </div>
                
                {/* Timeline Grid Lines */}
                 <div className="absolute top-10 left-0 w-full h-full -z-10 pointer-events-none">
                     {gridLabels.map((_, index) => (
                         <div key={index} className="absolute h-full border-r border-light-border/50 dark:border-dark-border/50" style={{ left: `${(index / (gridLabels.length || 1)) * 100}%` }}></div>
                     ))}
                 </div>

                {/* Periods and Tasks */}
                <div className="space-y-8 mt-4">
                    {tasksByPeriod.map((period, periodIndex) => (
                        // Fix: Appwrite documents use $id for the document ID.
                        <div key={period.$id} style={{ animationDelay: isPublic ? `${periodIndex * 150}ms` : '0ms' }} className={isPublic ? 'animate-fade-in-up' : ''}>
                            <h3 className="font-bold text-lg mb-4 pointer-events-none">{period.title}</h3>
                            <div className="relative h-px bg-light-border dark:bg-dark-border">
                                {period.tasks.map((task, taskIndex) => {
                                    const left = getTaskLeftPercent(task.due_date);
                                    return (
                                        // Fix: Appwrite documents use $id for the document ID.
                                        <div key={task.$id} className="absolute top-1/2 -translate-y-1/2 group" style={{ left: `${left}%`, animationDelay: isPublic ? `${periodIndex * 150 + (taskIndex + 1) * 100}ms` : '0ms' }}>
                                             <div className={`h-3 w-3 rounded-full ${statusColors[task.status]} ring-4 ring-light-bg dark:ring-dark-bg transition-transform group-hover:scale-125 ${isPublic ? 'animate-pop-in' : ''}`}></div>
                                             <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-max max-w-xs bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text px-3 py-2 rounded-lg shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                <p className="font-bold">{task.title}</p>
                                                <p className="text-xs text-light-muted-text dark:text-dark-muted-text">{new Date(task.due_date!).toLocaleDateString('fa-IR')}</p>
                                                {isPublic && <p className="mt-1 text-xs border-t border-light-border dark:border-dark-border pt-1">{task.description}</p>}
                                             </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
             </div>
             {isPublic && (
                <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pop-in {
                        from { transform: scale(0); }
                        to { transform: scale(1); }
                    }
                    .animate-fade-in-up {
                        animation: fade-in-up 0.6s ease-out forwards;
                        opacity: 0;
                    }
                    .animate-pop-in {
                        animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                        transform: scale(0);
                    }
                `}</style>
             )}
        </div>
    );
};

export default TimelineView;