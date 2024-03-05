import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { Posts } from "@/app/_components/posts";
import { getAllPosts } from "../lib/api";

export default function Index() {
  const allPosts = getAllPosts();

  const posts = allPosts;

  return (
    <main>
      <Container>
        <Intro />
        {/* <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        /> */}
        <div className="lg:max-w-screen-md mx-auto">
          {posts.length > 0 && <Posts posts={posts} />}
        </div>
      </Container>
    </main>
  );
}
