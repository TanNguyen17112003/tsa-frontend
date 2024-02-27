import { v4 as uuidv4 } from "uuid";

// Define interface for each data type
export interface CollectionMin {
  id: string;
  name: string;
}

export interface SutraMin {
  id: string;
  name: string;
  collection_id: string;
}

export interface VolumeMin {
  id: string;
  name: string;
  sutra_id: string;
}

export interface OrisonMin {
  id: string;
  name: string;
  volume_id: string;
}

// Define interface for the entire data structure
export interface CollectionTreeResponse {
  collections: CollectionMin[];
  sutras: SutraMin[];
  volumes: VolumeMin[];
  orisons: OrisonMin[];
}

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
