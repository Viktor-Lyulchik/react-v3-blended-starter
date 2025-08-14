import css from "./App.module.css";

import { useState } from "react";
import { getPhotos } from "../../services/photos";
import type { Photo } from "../../types/photo";
import toast, { Toaster } from "react-hot-toast";

import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const handleSearch = async (query: string) => {
    try {
      setPhotos([]);
      setIsLoading(true);
      setIsError(false);

      const data = (await getPhotos(query)) as Photo[];

      if (data.length === 0) {
        toast.error("No photos found for your request.");
      }

      setPhotos(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <>
      <div className={css.app}>
        <Toaster />
        <Section>
          <Container
            children={
              <>
                <Form onSubmit={handleSearch}></Form>
                {isError ? (
                  <Text>
                    <p>"Error of loading data from server"</p>
                  </Text>
                ) : (
                  photos.length > 0 && (
                    <PhotosGallery
                      array={photos}
                      onSelect={handleSelectPhoto}
                    ></PhotosGallery>
                  )
                )}
                {isLoading && <Loader />}
                {selectedPhoto && (
                  <Modal onClose={closePhotoModal}>
                    <img
                      src={selectedPhoto?.src.large}
                      alt={selectedPhoto?.alt}
                    />
                  </Modal>
                )}
              </>
            }
          ></Container>
        </Section>
      </div>
    </>
  );
}
