import PropTypes from 'prop-types';

export default function StatsCardVendor({ title, value, icon: Icon }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className="p-4 bg-blue-100 rounded-full">
            <Icon className="h-8 w-8 text-deep-orange-900" />
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
        </div>
    );
}

StatsCardVendor.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};