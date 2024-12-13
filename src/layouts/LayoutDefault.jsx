import PropTypes from 'prop-types';

function LayoutDefault({ children }) {
    return (
        <div>
            <main>{children}</main>
        </div>
    );
}
LayoutDefault.propTypes = {
    children: PropTypes.node.isRequired, 
};

export default LayoutDefault;
