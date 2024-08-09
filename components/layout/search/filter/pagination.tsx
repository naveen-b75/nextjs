'use client';
import { useRouter } from 'next/navigation';

const Pagination = ({
  TotalProducts,
  searchParams
}: {
  searchParams: any;
  TotalProducts: number;
}) => {
  const pagesCount = Math.ceil(TotalProducts / 8); // 100/10
  const currentPage = searchParams['page'];
  const router = useRouter();
  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
  const onPageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set(`page`, page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`, undefined);
  };
  return (
    <div>
      <h2 className="hidden">Pagination: </h2>
      <ul className="pagination-section my-[20px] flex justify-center gap-[10px]">
        {pages.map((page) => (
          <li key={page} className={page === currentPage ? 'active' : ''}>
            <a className="pagelink cursor-pointer" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
