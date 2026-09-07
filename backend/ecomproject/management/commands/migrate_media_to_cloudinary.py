import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
import cloudinary
import cloudinary.uploader
import cloudinary.api
from ecomproject.models import Products, CatagoryImage


class Command(BaseCommand):
    help = "Uploads existing local media images from backend/media (or static/images) to Cloudinary."

    def add_arguments(self, parser):
        parser.add_argument(
            "--overwrite",
            action="store_true",
            help="Overwrite images in Cloudinary if they already exist",
        )

    def handle(self, *args, **options):
        overwrite = options.get("overwrite", False)
        base_dir = Path(settings.BASE_DIR)
        media_dir = base_dir / "media"
        static_images_dir = base_dir / "static" / "images"

        self.stdout.write(self.style.NOTICE("==> Starting migration of local media to Cloudinary..."))

        # Collect unique image filenames from database
        db_images = set()
        for p in Products.objects.all():
            if p.image and p.image.name:
                # p.image.name might be 'media/filename.jpg' or 'filename.jpg'
                fname = os.path.basename(p.image.name)
                db_images.add(fname)

        for c in CatagoryImage.objects.all():
            if c.categoryimage and c.categoryimage.name:
                fname = os.path.basename(c.categoryimage.name)
                db_images.add(fname)

        # Also collect all files present in media_dir if it exists
        local_files = {}
        if media_dir.exists():
            for f in media_dir.iterdir():
                if f.is_file():
                    local_files[f.name] = f

        if static_images_dir.exists():
            for f in static_images_dir.iterdir():
                if f.is_file() and f.name not in local_files:
                    local_files[f.name] = f

        # Combine database images and local files
        all_targets = sorted(set(list(db_images) + list(local_files.keys())))

        self.stdout.write(f"Found {len(all_targets)} images to process.")

        uploaded_count = 0
        skipped_count = 0
        missing_count = 0

        for filename in all_targets:
            file_path = local_files.get(filename)
            if not file_path or not file_path.exists():
                self.stdout.write(self.style.WARNING(f"  [MISSING] {filename} not found locally in media/ or static/images/"))
                missing_count += 1
                continue

            public_id_name, _ = os.path.splitext(filename)
            full_public_id = f"media/{public_id_name}"

            # Check if file already exists in Cloudinary
            if not overwrite:
                try:
                    cloudinary.api.resource(full_public_id)
                    self.stdout.write(self.style.SUCCESS(f"  [EXISTS] {filename} already in Cloudinary, skipping."))
                    skipped_count += 1
                    continue
                except cloudinary.exceptions.NotFound:
                    pass
                except Exception as e:
                    # If error is not 404, proceed with upload
                    pass

            try:
                self.stdout.write(f"  [UPLOADING] {filename} -> {full_public_id} ...")
                res = cloudinary.uploader.upload(
                    str(file_path),
                    public_id=public_id_name,
                    folder="media",
                    overwrite=overwrite,
                    resource_type="image",
                )
                self.stdout.write(self.style.SUCCESS(f"  [SUCCESS] Uploaded {filename} -> {res.get('secure_url')}"))
                uploaded_count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  [ERROR] Failed to upload {filename}: {e}"))

        self.stdout.write(self.style.NOTICE(
            f"\n==> Migration Summary:\n"
            f"    Uploaded: {uploaded_count}\n"
            f"    Already existed: {skipped_count}\n"
            f"    Missing files: {missing_count}\n"
            f"    Total processed: {len(all_targets)}"
        ))
