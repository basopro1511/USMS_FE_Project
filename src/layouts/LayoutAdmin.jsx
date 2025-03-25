import PropTypes from 'prop-types';
import SidebarAdmin from '../components/admin/SidebarAdmin';
import HeaderAdmin from '../components/admin/HeaderAdmin';

function LayoutAdmin({ children }) {
    return (
      <div className="flex bg-secondaryGray max-w-false" >
                 <SidebarAdmin/>
                    <div>
                        <HeaderAdmin></HeaderAdmin>
                        <main>{children}</main>
                    </div>
        </div>
    );
}
LayoutAdmin.propTypes = {
    children: PropTypes.node.isRequired, // `children` là React node và bắt buộc
};

export default LayoutAdmin;
