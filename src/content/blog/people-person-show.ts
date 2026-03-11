import type { BlogPost } from '@/lib/blog-types'

export const post: BlogPost = {
  slug: 'technical-director-people-person-show',
  title: 'Technical Director at the People Person Show',
  date: '2025-03-11',
  image: 'https://www.fabfabfabfabfab.com/images/People%20Person%20Work%20in%20progress%20is%20live.jpg',
  imageAlt: 'People Person Show — Work in Progress',
  excerpt:
    'Working with Fab on a work-in-progress theatre show in London, building electronic props that blur the line between vintage objects and AI. A retrofitted telephone, a sentient street light, and a small audience in a Hackney studio.',
  content: [
    {
      type: 'paragraph',
      text: "I'm currently serving as Technical Director on the People Person Show, a work-in-progress theatre piece created and performed by Fab. The show runs in an intimate format with a very small audience at Fab's studio near Hackney Central, which gives the whole thing a raw, close-up energy that a bigger venue would kill.",
    },
    {
      type: 'paragraph',
      text: "My role is building the electronic props that Fab interacts with during the performance. The props aren't set dressing. They respond, react, and talk back.",
    },
    {
      type: 'heading',
      text: 'The Telephone',
    },
    {
      type: 'paragraph',
      text: "We're retrofitting a vintage telephone and connecting it to an ElevenLabs backend. During the show, Fab can pick up the receiver and have a live conversation with an AI agent. The voice on the other end is generated in real time, allowing the dialogue to shift depending on how the scene is going. The hardware is original, the conversation is not.",
    },
    {
      type: 'heading',
      text: 'The Street Light',
    },
    {
      type: 'paragraph',
      text: "The second prop is an intelligent street light that interacts with video content being projected on stage. It reads cues from the projection and responds with light behaviour, creating a feedback loop between the physical object and the screen. The idea is that the light becomes a character in the room rather than just a prop.",
    },
    {
      type: 'heading',
      text: 'Very Limited Places',
    },
    {
      type: 'paragraph',
      text: "The show is deliberately small. Limited seats, no frills, work-in-progress. If you want to see where this is going, the link below has everything you need.",
    },
  ],
  link: {
    label: 'Get tickets',
    url: 'https://fabfabfabfabfab.bigcartel.com/product/peoplepersonwip1',
  },
}
