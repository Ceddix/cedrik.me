import React from "react";

import PageWrapper from "@/app/components/PageWrapper";
import { age } from "@/app/components/Constants";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});

export const metadata = {
  title: "About",
};

export default function About() {
  return (
    // Navbar (delay with text)
    // Activity

    <>
      <PageWrapper>
        Hey there! I'm Cedrik, a {age} years old tech-loving student from
        Belgium, living near the borders of Germany and the Netherlands. I just
        finished my Abitur and I'm looking forward to start my International
        Business studies at Maastricht University this September. But hey,
        that's not all I'm about!
        <br />
        <br />
        Since I was a kid, I've been drawn to technology like a magnet. I'd
        tinker with every electronic gadget I could find, trying to unlock all
        their hidden secrets. When I discovered Minecraft, I was hooked. I'd
        dive into creating redstone and commandblock contraptions, building my
        own virtual worlds from scratch.
        <br />
        <br />
        (image?)
        <br />
        <br />
        Guess what? My passion didn't stop there. I got curious about Minecraft
        servers and soon enough, I was learning script languages and built some
        overcomplicated commands. I teamed up with a friend to create our own
        little server (which never saw the light of day, but we had fun!).
        Eventually, I landed on the server I'm part of today – CraftTogetherMC –
        and boy, it's been an amazing journey.
        <br />
        <br />
        (image ct)
        <br />
        <br />
        At CraftTogetherMC, we've built some pretty cool stuff together. One of
        our proudest achievements is our annual winter advent calendar and
        Christmas market. Imagine a world filled with secrets and daily
        mini-games. In 2020 we built a huge ice castle with Frozen vibes, you
        could ride gondolas through the map. Outside, there were cute little
        winter villages and even an extremely fun sleigh ride. Just look at
        these videos and images:
        <br />
        <br />
        (image gallery advent calendar)
        <br />
        <br />
        Another special feature of CT is our vast rail network using TrainCarts
        plugin, called CraftBahn. You can hop on a train and explore various
        stations, even switch servers on your journey.
        <br />
        <br />
        (image gallery craftbahn)
        <br />
        <br />
        However, the main concept of CraftTogetherMC is to offer our
        German-speaking community a server that feels almost vanilla, only with
        the possibility to play together with others. We have open freebuild
        world without claiming restrictions, money system, but with nice and
        active community in all ages.
        <br />
        <br /> Curious about our server? Hop on and join the fun!
        <br /> - Look at our map and explore our in-game world:
        <br /> - Join our vibrant Minecraft community on Discord:
        <br /> - Check out our website the get to know the server:
        <br />
        <br />
        Oh, and here's a bit more about me. I started learning programming a few
        years ago, thanks to the person who built up CraftTogetherMC. I'm mostly
        self-taught, relying on the internet and other open-source projects to
        pick up various programming languages. It's been a journey full of
        challenges and exciting discoveries.
        <br />
        As part of my programming journey, I created this website you're on
        right now — my first real project.
        <br />
        <br />
        <b>
          I'd love to connect with fellow tech enthusiasts, Minecraft fans, or
          just anyone who wants to say hi! Feel free to drop me a message on the
          contact section of this page — I'm all ears!
        </b>
        <br />
        <br />
        Follow Me:
        <br />- Catch some snapshots of my tech adventures and daily life on
        Instagram!
        <br />- Let's connect on Twitter and share our tech stories!
        <br />- Join my small community on Discord!
      </PageWrapper>
    </>
  );
}
