import PropTypes from "prop-types";
import HeaderUser from "../components/user/HeaderFooter/HeaderUser";
import FooterUser from "../components/user/HeaderFooter/FooterUser";

function LayoutUser({ children }) {
  return (
    <div style={{}}>
      <div className="w-screen " style={{ maxWidth: false , alignItems:"center"}}>
        <HeaderUser></HeaderUser>
        <main>{children}</main>
        <FooterUser></FooterUser>
      </div>
    </div>
  );
}
LayoutUser.propTypes = {
  children: PropTypes.node.isRequired, // `children` là React node và bắt buộc
};

export default LayoutUser;
