import PropTypes from 'prop-types';
import SidebarManage from '../components/management/HeaderFooter/SideBarManage';
import HeaderManage from '../components/management/HeaderFooter/HeaderManage';

function LayoutManage({ children }) {
    return (
      <div className="flex bg-secondaryGray max-w-false" >
                 <SidebarManage/>
                    <div>
                        <HeaderManage></HeaderManage>
                        <main>{children}</main>
                    </div>
        </div>
    );
}
LayoutManage.propTypes = {
    children: PropTypes.node.isRequired, // `children` là React node và bắt buộc
};

export default LayoutManage;
