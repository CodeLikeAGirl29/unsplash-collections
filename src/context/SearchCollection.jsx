import { createContext, useContext, useEffect, useState } from "react";
import useCollections from "../features/collections/useCollections";
import { useParams } from "react-router-dom";

/**
 * @typedef {Object} Image
 * @property {string} imageId - The unique ID of the image.
 */

/**
 * @typedef {Object} Collection
 * @property {string} name - The name of the collection.
 * @property {Image[]} images - List of images in the collection.
 */

/**
 * @typedef {Object} SearchCollectionsContextValue
 * @property {Collection[]} collections - The filtered list of collections.
 * @property {function(string, string): void} search - Function to filter collections.
 * @property {boolean} isLoading - Loading state indicator.
 */

// Create context with a default value of `null`
const SearchCollectionsContext = createContext(null);

/**
 * Provider component for managing and searching collections.
 *
 * @param {{ children: React.ReactNode }} props
 */
function SearchCollectionsProvider({ children }) {
  const { id } = useParams();
  const { collections: initial = [], isLoading } = useCollections();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (initial.length > 0) {
      setCollections(
        initial.filter((collection) =>
          collection.images.every((image) => image.imageId !== id),
        ),
      );
    }
  }, [id, initial]);

  /**
   * Searches collections based on a query and excludes collections containing the given imageId.
   *
   * @param {string} query - The search term.
   * @param {string} imageId - The image ID to exclude.
   */
  const search = (query, imageId) => {
    setCollections(
      initial.filter(
        (collection) =>
          collection.name.toLowerCase().includes(query.toLowerCase()) &&
          collection.images.every((image) => image.imageId !== imageId),
      ),
    );
  };

  return (
    <SearchCollectionsContext.Provider
      value={{ collections, search, isLoading }}
    >
      {children}
    </SearchCollectionsContext.Provider>
  );
}

/**
 * Custom hook for accessing the collections context.
 *
 * @returns {SearchCollectionsContextValue}
 */
export const useCollectionsList = () => {
  const context = useContext(SearchCollectionsContext);
  if (!context) {
    throw new Error(
      "useCollectionsList must be used within a SearchCollectionsProvider",
    );
  }
  return context;
};

export default SearchCollectionsProvider;
