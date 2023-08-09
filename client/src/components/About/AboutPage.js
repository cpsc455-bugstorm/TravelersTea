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
          url: 'https://www.linkedin.com/in/noreen-chan-a79607173/',
        },
      ],
    },
    {
      name: 'Vaishnavi Sinha',
      imageURL:
        'https://media.licdn.com/dms/image/D4E03AQE9MRFnA9hYvw/profile-displayphoto-shrink_400_400/0/1665122576136?e=1697068800&v=beta&t=1GoXBhVQtWu6mA9yCuhRusS8LzHjEb-phCMOt6IjA5A',
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
        'https://media.discordapp.net/attachments/1138670571132031126/1138677413954461736/242227090_546933233267116_242392761055372403_n.png',
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
    {
      name: 'Rithin Kumar',
      imageURL:
        'https://media.licdn.com/dms/image/C5603AQFxt0mogWEkmw/profile-displayphoto-shrink_800_800/0/1635227352414?e=1697068800&v=beta&t=CKvWBVXgY528aak86O2g4s1mMwxxFrFsZ7cWb2_M_iM',
      socialLinks: [
        {
          platform: 'GitHub',
          url: 'https://github.com/L0Lmaker',
        },
        {
          platform: 'LinkedIn',
          url: 'https://www.linkedin.com/in/rithin-kumar/',
        },
      ],
    },
  ]

  return (
    <div className='container mx-auto h-screen overflow-y-auto p-4'>
      <h1 className='my-8 text-center text-4xl font-bold'>
        Made with ❤️ by Team BugStorm
      </h1>
      <div>
        {developers.map((developer, index) => (
          <DeveloperSection key={index} developer={developer} />
        ))}
      </div>
    </div>
  )
}

export default AboutPage
