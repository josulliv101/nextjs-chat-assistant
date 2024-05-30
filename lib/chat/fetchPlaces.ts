export default async function fetchPlaces(placeIds: Array<string> = []) {
  const endpoint =
    'https://firestore.googleapis.com/v1/projects/ai-genkit-rag/databases/(default)/documents/buildPlaces/'

  console.log('getRecommendations/placeIds', placeIds)
  const placesList = await Promise.all(
    placeIds
      .filter(id => !!id)
      .map((placeId: any) =>
        fetch(`${endpoint}${placeId}`, {
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
          .then(resp => resp.json())
          .then(({ ref, ...data }) => data)
      )
  )
  return placesList
}
