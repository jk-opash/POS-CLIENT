"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

function formatDate(date) {
  if (!date) return "";
  return `${String(date.getDate()).padStart(2,"0")} ${MONTHS[date.getMonth()].slice(0,3)} ${date.getFullYear()}`;
}

function formatInput(date) {
  if (!date) return "";
  return `${String(date.getMonth()+1).padStart(2,"0")} / ${String(date.getDate()).padStart(2,"0")} / ${date.getFullYear()}`;
}

function startOfDay(d) {
  const c = new Date(d);
  c.setHours(0,0,0,0);
  return c;
}

function isSameDay(a,b) {
  if (!a||!b) return false;
  return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
}

function isInRange(day,start,end) {
  if (!start||!end) return false;
  const d = startOfDay(day);
  return d>startOfDay(start)&&d<startOfDay(end);
}

function getDaysInMonth(year,month) {
  return new Date(year,month+1,0).getDate();
}

function getFirstDayOfWeek(year,month) {
  const d = new Date(year,month,1).getDay();
  return d===0?6:d-1;
}

const SHORTCUTS = [
  { label:"Today",      getValue:()=>{ const t=new Date(); return {startDate:startOfDay(t),endDate:startOfDay(t)}; }},
  { label:"Yesterday",  getValue:()=>{ const t=new Date(); t.setDate(t.getDate()-1); return {startDate:startOfDay(t),endDate:startOfDay(t)}; }},
  { label:"This week",  getValue:()=>{ const t=new Date(); const day=t.getDay()===0?6:t.getDay()-1; const s=new Date(t); s.setDate(t.getDate()-day); return {startDate:startOfDay(s),endDate:startOfDay(t)}; }},
  { label:"Last week",  getValue:()=>{ const t=new Date(); const day=t.getDay()===0?6:t.getDay()-1; const s=new Date(t); s.setDate(t.getDate()-day-7); const e=new Date(s); e.setDate(s.getDate()+6); return {startDate:startOfDay(s),endDate:startOfDay(e)}; }},
  { label:"This month", getValue:()=>{ const t=new Date(); return {startDate:new Date(t.getFullYear(),t.getMonth(),1),endDate:new Date(t.getFullYear(),t.getMonth()+1,0)}; }},
  { label:"Last month", getValue:()=>{ const t=new Date(); return {startDate:new Date(t.getFullYear(),t.getMonth()-1,1),endDate:new Date(t.getFullYear(),t.getMonth(),0)}; }},
  { label:"This year",  getValue:()=>{ const t=new Date(); return {startDate:new Date(t.getFullYear(),0,1),endDate:new Date(t.getFullYear(),11,31)}; }},
  { label:"Last year",  getValue:()=>{ const t=new Date(); return {startDate:new Date(t.getFullYear()-1,0,1),endDate:new Date(t.getFullYear()-1,11,31)}; }},
  { label:"All time",   getValue:()=>{ return {startDate:new Date(2000,0,1),endDate:new Date()}; }},
];

function CalendarGrid({ year, month, startDate, endDate, hoverDate, onDayClick, onDayHover, selecting }) {
  const firstDay = getFirstDayOfWeek(year,month);
  const daysInMonth = getDaysInMonth(year,month);
  const prevDays = getDaysInMonth(year,month-1<0?11:month-1);

  const cells = [];
  for (let i=firstDay-1;i>=0;i--) cells.push({day:prevDays-i,current:false});
  for (let d=1;d<=daysInMonth;d++) cells.push({day:d,current:true});
  const trailing = 42-cells.length;
  for (let d=1;d<=trailing;d++) cells.push({day:d,current:false});

  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d=>(
          <div key={d} className="text-center text-[11px] font-semibold text-brand-muted py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell,idx)=>{
          const cellDate = cell.current ? new Date(year,month,cell.day) : null;
          const effectiveEnd = selecting&&!endDate&&hoverDate ? hoverDate : endDate;
          const isStart = cellDate&&isSameDay(cellDate,startDate);
          const isEnd   = cellDate&&isSameDay(cellDate,endDate);
          const inRange = cellDate&&startDate&&effectiveEnd&&isInRange(cellDate,startDate,effectiveEnd);

          let wrapCls = "flex items-center justify-center h-7 ";
          let btnCls  = "w-7 h-7 flex items-center justify-center text-[13px] rounded-full ";

          if (!cell.current) {
            btnCls += "text-brand-muted cursor-default";
          } else {
            if (inRange) wrapCls += "bg-brand-primaryLight ";
            if (isStart&&(inRange||(selecting&&hoverDate&&hoverDate>startDate))) wrapCls += "rounded-l-full bg-brand-primaryLight ";
            if (isEnd&&(inRange||isStart)) wrapCls += "rounded-r-full bg-brand-primaryLight ";
            if (isStart||isEnd) btnCls += "bg-brand-primary text-white font-semibold cursor-pointer ";
            else if (inRange) btnCls += "text-brand-primary cursor-pointer ";
            else btnCls += "text-brand-dark cursor-pointer hover:bg-brand-light ";
          }

          return (
            <div key={idx} className={wrapCls}>
              <button
                type="button"
                className={btnCls}
                onClick={()=>cell.current&&onDayClick(new Date(year,month,cell.day))}
                onMouseEnter={()=>cell.current&&onDayHover&&onDayHover(new Date(year,month,cell.day))}
              >
                {cell.day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({ value, onChange, placeholder="Select Date Range" }) {
  const today = new Date();
  const [open, setOpen]               = useState(false);
  const [startDate, setStartDate]     = useState(value?.startDate?new Date(value.startDate):null);
  const [endDate,   setEndDate]       = useState(value?.endDate  ?new Date(value.endDate)  :null);
  const [hoverDate, setHoverDate]     = useState(null);
  const [leftMonth, setLeftMonth]     = useState(today.getMonth()===11?10:today.getMonth());
  const [leftYear,  setLeftYear]      = useState(today.getFullYear());
  const [activeShortcut, setActiveShortcut] = useState(null);
  const [pendingStart,   setPendingStart]   = useState(null);
  const [pendingEnd,     setPendingEnd]     = useState(null);
  const [selecting,      setSelecting]      = useState(false);
  const wrapperRef = useRef(null);

  const rightMonth = (leftMonth+1)%12;
  const rightYear  = leftMonth===11?leftYear+1:leftYear;

  useEffect(()=>{
    function outside(e){
      if(wrapperRef.current&&!wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown",outside);
    return ()=>document.removeEventListener("mousedown",outside);
  },[]);

  function handleOpen(){
    setPendingStart(startDate);
    setPendingEnd(endDate);
    setSelecting(false);
    setHoverDate(null);
    setOpen(o=>!o);
  }

  function handleDayClick(date){
    if(!selecting||(pendingStart&&pendingEnd)){
      setPendingStart(date); setPendingEnd(null); setSelecting(true); setActiveShortcut(null);
    } else {
      if(pendingStart&&date<pendingStart){ setPendingEnd(pendingStart); setPendingStart(date); }
      else setPendingEnd(date);
      setSelecting(false); setHoverDate(null);
    }
  }

  function handleShortcut(s){
    const {startDate:sd,endDate:ed}=s.getValue();
    setPendingStart(sd); setPendingEnd(ed); setSelecting(false); setActiveShortcut(s.label);
    const lm=sd.getMonth()===11?10:sd.getMonth();
    setLeftMonth(lm); setLeftYear(sd.getFullYear());
  }

  function handleApply(){
    if(!pendingStart||!pendingEnd) return;
    setStartDate(pendingStart); setEndDate(pendingEnd);
    onChange&&onChange({startDate:pendingStart,endDate:pendingEnd});
    setOpen(false);
  }

  function handleCancel(){
    setPendingStart(startDate); setPendingEnd(endDate); setSelecting(false); setOpen(false);
  }

  function prevMonth(){
    if(leftMonth===0){setLeftMonth(11);setLeftYear(y=>y-1);}
    else setLeftMonth(m=>m-1);
  }
  function nextMonth(){
    if(leftMonth>=10){
      if(leftMonth===11){setLeftMonth(0);setLeftYear(y=>y+1);}
      else setLeftMonth(m=>m+1);
    } else {
      setLeftMonth(m=>m+1);
    }
  }

  const displayValue = startDate&&endDate
    ? `${formatDate(startDate)}  –  ${formatDate(endDate)}`
    : startDate ? formatDate(startDate) : "";

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 bg-white border border-brand-light rounded-xl px-4 py-2 text-sm font-semibold text-brand-dark shadow-sm hover:border-brand-primary transition-colors min-w-[200px] whitespace-nowrap"
      >
        <CalendarDays size={15} className="text-brand-primary shrink-0" />
        <span className={displayValue?"text-brand-dark":"text-brand-muted font-normal"}>
          {displayValue||placeholder}
        </span>
      </button>

      {/* Dropdown — right-aligned so it never overflows the right edge */}
      {open&&(
        <div
          className="absolute right-0 top-full mt-2 z-[9999] bg-white border border-brand-light rounded-2xl shadow-2xl overflow-hidden"
          style={{width:620}}
        >
          <div className="flex">
            {/* Shortcuts sidebar */}
            <div className="flex flex-col border-r border-brand-light py-4 px-2 shrink-0" style={{width:130}}>
              {SHORTCUTS.map(s=>(
                <button
                  key={s.label}
                  type="button"
                  onClick={()=>handleShortcut(s)}
                  className={`text-left px-3 py-[7px] rounded-lg text-[13px] transition-colors mb-0.5 ${
                    activeShortcut===s.label
                      ?"bg-brand-primaryLight text-brand-primary font-semibold"
                      :"text-brand-dark hover:bg-brand-light hover:text-brand-dark"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Dual calendars */}
            <div className="flex-1 px-4 pt-4 pb-0 min-w-0">
              <div className="flex items-center mb-3">
                <button type="button" onClick={prevMonth} className="p-1 hover:bg-brand-light rounded-lg shrink-0">
                  <ChevronLeft size={15} className="text-brand-muted" />
                </button>
                <div className="flex flex-1 justify-around">
                  <span className="text-[13px] font-semibold text-brand-dark">{MONTHS[leftMonth]} {leftYear}</span>
                  <span className="text-[13px] font-semibold text-brand-dark">{MONTHS[rightMonth]} {rightYear}</span>
                </div>
                <button type="button" onClick={nextMonth} className="p-1 hover:bg-brand-light rounded-lg shrink-0">
                  <ChevronRight size={15} className="text-brand-muted" />
                </button>
              </div>

              <div className="flex gap-3">
                <CalendarGrid
                  year={leftYear} month={leftMonth}
                  startDate={pendingStart} endDate={pendingEnd}
                  hoverDate={hoverDate} selecting={selecting}
                  onDayClick={handleDayClick}
                  onDayHover={d=>selecting&&setHoverDate(d)}
                />
                <div className="w-px bg-brand-light my-1 shrink-0"/>
                <CalendarGrid
                  year={rightYear} month={rightMonth}
                  startDate={pendingStart} endDate={pendingEnd}
                  hoverDate={hoverDate} selecting={selecting}
                  onDayClick={handleDayClick}
                  onDayHover={d=>selecting&&setHoverDate(d)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-brand-light px-4 py-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="border border-brand-light rounded-lg px-3 py-1.5 bg-brand-light text-[11px] font-mono text-brand-dark min-w-[115px]">
                {pendingStart?formatInput(pendingStart):<span className="text-brand-muted">Start date</span>}
              </div>
              <span className="text-brand-muted text-xs">–</span>
              <div className="border border-brand-light rounded-lg px-3 py-1.5 bg-brand-light text-[11px] font-mono text-brand-dark min-w-[115px]">
                {pendingEnd?formatInput(pendingEnd):<span className="text-brand-muted">End date</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-1.5 text-sm font-medium text-brand-dark border border-brand-light rounded-xl hover:bg-brand-light transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!pendingStart||!pendingEnd}
                className="px-5 py-1.5 text-sm font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
