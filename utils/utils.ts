

// is file a valid image file
export const isImage = (file: any) => {
    return file.type.split('/')[0] === 'image';
}