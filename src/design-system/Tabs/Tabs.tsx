import { useState, useRef, useEffect, useCallback } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import './Tabs.css';

export type TabsType = 'fixed' | 'scrollable';
export type TabsStyle = 'primary' | 'secondary';
export type TabsConfiguration = 'label-only' | 'label-icon' | 'icon-only';

export interface TabItem {
  label: string;
  icon?: React.ReactNode;
  badge?: boolean;
  disabled?: boolean;
}

export interface TabsProps {
  /** Fixed: tabs equally share the full width. Scrollable: tabs have natural width and scroll. */
  type?: TabsType;
  /** Primary: active label uses brand color + underline inside content area.
   *  Secondary: active label uses dark text + full-width bottom underline. */
  tabStyle?: TabsStyle;
  /** What each tab item shows: label only, icon + label stacked, or icon only. */
  configuration?: TabsConfiguration;
  /** Tab item definitions */
  tabs: TabItem[];
  /** Controlled active tab index */
  activeIndex?: number;
  /** Uncontrolled initial active tab index */
  defaultActiveIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function Tabs({
  type = 'fixed',
  tabStyle = 'primary',
  configuration = 'label-only',
  tabs,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onChange,
  className = '',
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultActiveIndex);
  const isControlled = activeIndexProp !== undefined;
  const activeIndex = isControlled ? activeIndexProp : internalActive;

  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    // -1 to absorb subpixel rounding
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    if (type !== 'scrollable') return;
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [type, updateScrollState, tabs]);

  function handleArrowClick(direction: 'left' | 'right') {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  }

  function handleClick(index: number) {
    if (tabs[index]?.disabled) return;
    if (!isControlled) setInternalActive(index);
    onChange?.(index);
  }

  const showIcon = configuration === 'label-icon' || configuration === 'icon-only';
  const showLabel = configuration === 'label-only' || configuration === 'label-icon';

  return (
    <div
      className={['tabs', className].filter(Boolean).join(' ')}
      data-type={type}
      data-tab-style={tabStyle}
      data-configuration={configuration}
    >
      <div className="tabs__nav">
        {type === 'scrollable' && (
          <button
            className="tabs__arrow tabs__arrow--left"
            aria-hidden="true"
            tabIndex={-1}
            data-visible={canScrollLeft || undefined}
            onClick={() => handleArrowClick('left')}
          >
            <CaretLeft size={16} weight="bold" />
          </button>
        )}

        <div className="tabs__track" role="tablist" aria-label="Tabs" ref={trackRef}>
          {tabs.map((tab, i) => {
            const isActive = i === activeIndex;
            const isDisabled = !!tab.disabled;

            return (
              <button
                key={i}
                role="tab"
                aria-selected={isActive}
                disabled={isDisabled}
                tabIndex={isActive ? 0 : -1}
                className="tabs__tab"
                data-active={isActive || undefined}
                data-disabled={isDisabled || undefined}
                onClick={() => handleClick(i)}
              >
                <span className="tabs__tab-content">
                  {showIcon && tab.icon && (
                    <span className="tabs__tab-icon" aria-hidden="true">
                      {tab.icon}
                    </span>
                  )}
                  {showLabel && (
                    <span className="tabs__tab-label">{tab.label}</span>
                  )}
                  {tab.badge && <span className="tabs__badge" aria-label="notification" />}
                </span>
              </button>
            );
          })}
        </div>

        {type === 'scrollable' && (
          <button
            className="tabs__arrow tabs__arrow--right"
            aria-hidden="true"
            tabIndex={-1}
            data-visible={canScrollRight || undefined}
            onClick={() => handleArrowClick('right')}
          >
            <CaretRight size={16} weight="bold" />
          </button>
        )}
      </div>
      <div className="tabs__divider" aria-hidden="true" />
    </div>
  );
}
