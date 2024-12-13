import PropTypes from 'prop-types';
import SidebarManage from '../components/management/HeaderFooter/SideBarManage';
import HeaderManage from '../components/management/HeaderFooter/HeaderManage';

function LayoutManage({ children }) {
    return (
        <div style={{display:'flex'}}>
             <div className='w-screen ' style={{display: 'flex', backgroundColor:"#e0e5e9", maxWidth: false}}>
                <div style={{marginLeft:"auto"}}>
                 <SidebarManage/>
                </div>
                    <div style={{paddingTop:15, marginRight:"auto", }}>
                        <HeaderManage></HeaderManage>
                        <main>{children}</main>
                    </div>
            </div>
        </div>
    );
}
LayoutManage.propTypes = {
    children: PropTypes.node.isRequired, // `children` là React node và bắt buộc
};

export default LayoutManage;
