import Container from "@/app/_components/container";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-8 flex flex-col lg:flex-row items-center">
          <h3 className="text-2xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Built with ❤️ by the Roadrunner team
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://github.com/AugustanaCSC490Spring2024/Roadrunner"
              className="mx-3 font-bold hover:underline"
            >
              Github
            </a>
            <a
              href="https://github.com/orgs/AugustanaCSC490Spring2024/projects/1/views/4"
              className="mx-3 font-bold hover:underline"
            >
              Roadmap
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
