import DeveloperSection from './DeveloperSection'

const AboutPage = () => {
  const developers = [
    {
      name: 'Lymeng Naret',
      imageURL:
        'https://media.licdn.com/dms/image/D5603AQFMAoth3qD3SA/profile-displayphoto-shrink_400_400/0/1666244714143?e=1697068800&v=beta&t=ayGFDMz8s7ic_feeNuu5S4uEulG1t3vhiAAXFCzl-ds',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/NLmeng' },
        {
          platform: 'LinkedIn',
          url: 'https://www.linkedin.com/in/lymengnaret/',
        },
      ],
    },
    {
      name: 'Noreen Chan',
      imageURL:
        'https://media.discordapp.net/attachments/1138670571132031126/1138671976278392922/2f87e5640674dc70c9eafec452c12744.png?width=180&height=180',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/Graywing13' },
        {
          platform: 'LinkedIn',
          url: 'https://www.linkedin.com/in/lymengnaret/',
        },
      ],
    },
    {
      name: 'Vaishnavi Sinha',
      imageURL: 'https://via.placeholder.com/200',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/vee-16' },
        {
          platform: 'LinkedIn',
          url: 'https://ca.linkedin.com/in/vaishnavi-sinha',
        },
      ],
    },
    {
      name: 'Andy Liang',
      imageURL:
        'https://instagram.fcxh2-1.fna.fbcdn.net/v/t51.2885-19/242227090_546933233267116_242392761055372403_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fcxh2-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=uzaMVX6LRNEAX-E_gEd&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfDk8pL7p8euPjocqJSrBe2ctEjV8XTLcdF9onEvOs8MOQ&oe=64D7B886&_nc_sid=8b3546',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/AndyLiang1' },
        {
          platform: 'LinkedIn',
          url: 'https://www.linkedin.com/in/andyliang1000/',
        },
        {
          platform: 'Instagram',
          url: 'https://www.instagram.com/andyliang1000/',
        },
      ],
    },
  ]

  return (
    <div className='overflow-y-aut container mx-auto h-fit p-4'>
      <h1 className='my-8 text-center text-4xl font-bold'>
        Made with ❤️ by Team BugStorm
      </h1>
      {developers.map((developer, index) => (
        <DeveloperSection key={index} developer={developer} />
      ))}
    </div>
  )
}

export default AboutPage
