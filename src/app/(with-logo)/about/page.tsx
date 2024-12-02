import Link from "next/link";

export default function About() {
    return (
        <div className="h-full w-full flex flex-col justify-around content-center flex-wrap">
            <h2>About the project</h2>
            <div>
                <p>Compute the world was created by Aleksey Rogatin from group 1413.</p>
                <p>This is a project made as my graduate work for Ryazans State Radioengineering University.</p>
                <p>It is heavily inspired and influenced by <a href="https://nandgame.com/">Nand game.</a></p>
                <p>
                    The main goal of this project is to increase the knowledge of computer structural components 
                    both in professional and unprofessional spheres.
                </p>
            </div>
            <div>
                <h3>Links to used resources are below:</h3>
                <ul>
                    <li>Nand game - <a href="https://nandgame.com/">https://nandgame.com/</a></li>
                </ul>
            </div>
            <Link href="/" className="bordered">Go to home page</Link>
        </div>
    )
}