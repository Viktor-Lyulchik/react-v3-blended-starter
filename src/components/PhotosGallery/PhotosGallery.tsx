import type { Photo } from "../../types/photo";
import Grid from "../Grid/Grid";
import GridItem from "../GridItem/GridItem";
import PhotosGalleryItem from "../PhotosGalleryItem/PhotosGalleryItem";

interface PhotosGalleryProp {
  array: Photo[];
  onSelect: (photo: Photo) => void;
}
export default function PhotosGallery({ array, onSelect }: PhotosGalleryProp) {
  return (
    <Grid>
      {array.map((photo) => {
        return (
          <GridItem key={photo.id} onClick={onSelect} photo={photo}>
            <PhotosGalleryItem photo={photo} />
          </GridItem>
        );
      })}
    </Grid>
  );
}
