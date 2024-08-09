import { default as BigcommerceGrid } from 'bigCommerceComponents/grid';
import Grid from 'components/grid';
import { default as MagentoGrid } from 'magentoComponents/grid';

const platformType = process.env.ECOMMERCE_PLATFORM;

export default function Loading() {
  if (platformType?.toLocaleLowerCase() === 'magento') {
    return (
      <MagentoGrid className="grid-cols-2 lg:grid-cols-3">
        {Array(12)
          .fill(0)
          .map((_, index) => {
            return (
              <MagentoGrid.Item
                key={index}
                className="animate-pulse bg-neutral-100 dark:bg-neutral-900"
              />
            );
          })}
      </MagentoGrid>
    );
  }
  if (platformType?.toLocaleLowerCase() === 'bigcommerce') {
    return (
      <BigcommerceGrid className="grid-cols-2 lg:grid-cols-3">
        {Array(12)
          .fill(0)
          .map((_, index) => {
            return (
              <BigcommerceGrid.Item
                key={index}
                className="animate-pulse bg-neutral-100 dark:bg-neutral-900"
              />
            );
          })}
      </BigcommerceGrid>
    );
  }
  return (
    <Grid className="grid-cols-2 lg:grid-cols-3">
      {Array(12)
        .fill(0)
        .map((_, index) => {
          return (
            <Grid.Item key={index} className="animate-pulse bg-neutral-100 dark:bg-neutral-900" />
          );
        })}
    </Grid>
  );
}
