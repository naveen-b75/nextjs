import DesktopMenu from 'components/layout/navbar/desktop-menu';
import { VercelMagentoMenu } from 'lib/magento/types';

const MegaMenu = ({ menus }: { menus: VercelMagentoMenu[] }) => {
  return <DesktopMenu menu={menus} />;
};

export default MegaMenu;
