import { faker } from "@faker-js/faker";

function getRandomIndex(len: number) {
    return Math.abs(Math.floor(Math.random() * len));
}

export default function generateRandomImages(numberOfImages = 10) {
    const results = [];

    try {
        for (let index = 0; index < numberOfImages; index++) {
            const imageDimensions: {
                    width?: number;
                    height?: number;
                    category?: string;
                } = getRandomIndex(numberOfImages) >= index ? { width: 480, height: 960 } : { width: 480, height: 240 },
                imageUrl = faker.image.urlLoremFlickr(imageDimensions);
            results.push(imageUrl);
        }

        return results;
    } catch (error) {
        console.log("Error in the generate images function", error);
        return results;
    }
}
