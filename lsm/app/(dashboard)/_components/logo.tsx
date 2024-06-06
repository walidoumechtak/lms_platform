import Image from 'next/image'

export const Logo = () => {
    return (
        <div>
            <Image
                alt='logo'
                src={'/logo.svg'}
                width={120}
                height={120}  
            />
        </div>
    );
}