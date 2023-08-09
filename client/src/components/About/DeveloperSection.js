import PropTypes from 'prop-types'

const DeveloperSection = ({ developer }) => (
  <div className='m-4 mx-auto max-w-xl overflow-hidden rounded-lg border-b-2 bg-white pb-8 pt-4 shadow-md'>
    <img
      className='mx-auto mt-4 h-16 w-16 rounded-full'
      src={developer.imageURL}
      alt={developer.name}
    ></img>
    <h2 className='mb-2 mt-4 text-center text-2xl font-bold text-gray-800'>
      {developer.name}
    </h2>
    <div className='flex justify-center py-2'>
      {developer.socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          className='mx-2 text-blue-500 hover:text-blue-700'
        >
          {link.platform}
        </a>
      ))}
    </div>
  </div>
)

DeveloperSection.propTypes = {
  developer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    socialLinks: PropTypes.arrayOf(
      PropTypes.shape({
        platform: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
}

export default DeveloperSection
