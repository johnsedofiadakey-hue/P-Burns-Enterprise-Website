import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

export default async function ProjectsPage() {
  let projects = [
    { id: '1', title: 'Luxury Hotel Sefwi Dwinase', desc: 'Premium ceramic tiling for the entire lobby and suites.', image: '/category_ceramics.png' },
    { id: '2', title: 'Private Mansion Kumasi', desc: 'Custom imported security doors and window fixtures.', image: '/category_doors.png' },
    { id: '3', title: 'Corporate Office Ridge', desc: 'Modern glass partitions and accessories.', image: '/category_home_items.png' },
  ];

  try {
    const projectsSnap = await getDocFromServer(doc(db, "settings", "projects"));
    if (projectsSnap.exists()) {
      const data = projectsSnap.data();
      projects = [
        { id: '1', title: data.p1Title || projects[0].title, desc: data.p1Desc || projects[0].desc, image: data.p1Image || projects[0].image },
        { id: '2', title: data.p2Title || projects[1].title, desc: data.p2Desc || projects[1].desc, image: data.p2Image || projects[1].image },
        { id: '3', title: data.p3Title || projects[2].title, desc: data.p3Desc || projects[2].desc, image: data.p3Image || projects[2].image },
      ];
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-2 block">Inspiration</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-4">Featured Projects</h1>
          <p className="text-gray-500 text-lg">See how our materials transform spaces into luxury environments.</p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {projects.map((project) => (
            <div key={project.id} className="group flex flex-col">
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl mb-6 shadow-lg shadow-charcoal-900/5">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div>
                <span className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-1 block">Case Study</span>
                <h3 className="text-2xl font-serif font-bold text-[#111111] mb-2 group-hover:text-gold-600 transition-colors">{project.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{project.desc}</p>
                <span className="text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                  View Details 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
