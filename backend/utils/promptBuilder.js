exports.formatUserContextPrompt = (profile, basePrompt) => {
  return `
You're assisting a Moroccan content creator with the following profile:

- Name: ${profile.firstName} ${profile.lastName}
- Age: ${profile.age}, Gender: ${profile.gender}
- City: ${profile.city}, Country: ${profile.country}
- Platforms: ${profile.platforms.join(', ')}
- Main Platform: ${profile.mainPlatform}
- Content Types: ${profile.contentTypes.join(', ')}
- Content Categories: ${profile.contentCategories.join(', ')}
- Monetization Method: ${profile.monetizationMethod}
- Extra Info: ${profile.additionalInfo || 'N/A'}

${basePrompt}
  `;
};
