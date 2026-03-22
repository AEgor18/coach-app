import boto3
from botocore.client import Config
from botocore.exceptions import BotoCoreError, ClientError
from datetime import datetime, timedelta

from core.config import settings

class S3Storage:
    def __init__(self):
        session = boto3.session.Session()
        self.s3 = session.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY,
            aws_secret_access_key=settings.AWS_SECRET_KEY,
            region_name=settings.AWS_REGION,
            endpoint_url=settings.AWS_ENDPOINT_URL,
            config=Config(signature_version="s3v4"),
        )
        self.bucket_name = settings.AWS_BUCKET_NAME

        try:
            self.s3.head_bucket(Bucket=self.bucket_name)
        except ClientError:
            self.s3.create_bucket(Bucket=self.bucket_name)

    def upload_file(self, file_bytes: bytes, key: str, content_type: str) -> str:
        try:
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=file_bytes,
                ContentType=content_type,
            )
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Ошибка загрузки файла: {e}")
        return key

    def get_presigned_url(self, key: str, expires_in_seconds: int = 3600) -> str:
        try:
            url = self.s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": key},
                ExpiresIn=expires_in_seconds,
            )
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Ошибка генерации URL: {e}")
        return url

    def delete_file(self, key: str) -> bool:
        try:
            self.s3.delete_object(Bucket=self.bucket_name, Key=key)
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Ошибка удаления файла: {e}")
        return True

s3_storage = S3Storage()