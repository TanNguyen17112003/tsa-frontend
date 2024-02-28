import { CollectionTreeResponse } from "src/api/collections";
import { Author } from "src/types/author";
import { Circa } from "src/types/circas";
import { FormatPage } from "src/types/format-page";
import { FormatSutra } from "src/types/format-sutra";
import { FormatWord } from "src/types/format-word";
import { v4 as uuidv4 } from "uuid";

// Define interface for each data type

// Generate Vietnamese names using sample data
const vietnameseNames: string[] = [
  "Kinh Tụng",
  "Pháp Bảo",
  "Tam Muội",
  "Niệm Phật",
  "Giáo Lý",
];

// Generate sample data
const data: CollectionTreeResponse = {
  collections: [],
  sutras: [],
  volumes: [],
  orisons: [],
};

// Generate collections
for (let i = 0; i < 5; i++) {
  data.collections.push({
    id: uuidv4(),
    name: vietnameseNames[i],
  });
}

// Generate sutras
for (let i = 0; i < 5; i++) {
  for (const collection of data.collections) {
    data.sutras.push({
      id: uuidv4(),
      name: `${vietnameseNames[i]} Kinh`,
      collection_id: collection.id,
    });
  }
}

// Generate volumes
for (let i = 0; i < 5; i++) {
  for (const sutra of data.sutras) {
    data.volumes.push({
      id: uuidv4(),
      name: `${sutra.name} Tập ${i + 1}`,
      sutra_id: sutra.id,
    });
  }
}

// Generate orisons
for (let i = 0; i < 5; i++) {
  for (const volume of data.volumes) {
    data.orisons.push({
      id: uuidv4(),
      name: `${volume.name} - Bài ${i + 1}`,
      volume_id: volume.id,
    });
  }
}

// Export data for use
export default data;
