package utils

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func GenerateSessionID() string {
	b := make([]byte, 8)
	rand.Read(b)
	return hex.EncodeToString(b)
}

type UnsplashResponse struct {
	Results []struct {
		URLs struct {
			Regular string `json:"regular"`
		} `json:"urls"`
	} `json:"results"`
}

func FetchUnsplashImages(query string) []string {
	key := os.Getenv("UNSPLASH_ACCESS_KEY")
	url := fmt.Sprintf("https://api.unsplash.com/search/photos?query=%s&per_page=4&client_id=%s", query, key)

	resp, err := http.Get(url)
	if err != nil {
		return []string{}
	}
	defer resp.Body.Close()

	var data UnsplashResponse
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return []string{}
	}

	var images []string
	for _, result := range data.Results {
		images = append(images, result.URLs.Regular)
	}
	return images
}
