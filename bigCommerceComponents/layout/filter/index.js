'use client';
import Button from 'elements/Button/button';
import { useCallback, useState } from 'react';
import FilterComponent from './filter';

export default function FilterSidebar(filters) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  //hide and show the filters in mobile view.
  const toggleFilter = useCallback(() => {
    setIsFilterVisible(!isFilterVisible);
    if (isFilterVisible) {
      document.body.style.overflow = '';
      document.body.style.position = '';
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    }
  }, [setIsFilterVisible, isFilterVisible]);

  return (
    <>
      <aside>
        <div className="md:hidden">
          <Button
            type="button"
            disabled={false}
            onClick={() => toggleFilter()}
            priority="secondary"
            classes={{
              root: 'text-teal text-[14px] border-[2px] border-teal rounded-[6px] font-bold w-[92px] px-[32px] py-[9px] mb-[20px] md:mb-[40px] w-full',
              content: 'font-bold text-teal'
            }}
          >
            Filters{' '}
          </Button>
          {isFilterVisible && (
            <>
              <div className="fixed left-0 top-0 z-[21] h-[100vh] w-full overflow-auto bg-white px-[15px] py-[15px]">
                <span onClick={() => toggleFilter()}>
                  <svg
                    className="absolute right-[17px] top-[23px]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M15.96 15.24L15.24 15.96L8.04 8.76L0.8 16L0 15.2L7.24 7.96L0.0400004 0.76L0.760001 0.0399998L7.96 7.24L15.2 0L16 0.8L8.76 8.04L15.96 15.24Z"
                      fill="#636569"
                    />
                  </svg>
                </span>
                <FilterComponent
                  filters={filters.filters}
                  setFiltersList={filters.setFiltersList}
                />
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
