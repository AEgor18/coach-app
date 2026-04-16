import os
import json
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError


class S3Storage:
    def __init__(self):
        self.endpoint_url = os.getenv("MINIO_ENDPOINT", "http://minio:9000")
        self.access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin123_change_me")
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME", "coach-photos")

        self.s3 = boto3.client(
            's3',
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            config=Config(signature_version='s3v4'),
            region_name='us-east-1'
        )

        # Создаём/проверяем бакет
        try:
            self.s3.head_bucket(Bucket=self.bucket_name)
            print(f"✅ Bucket '{self.bucket_name}' уже существует")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == '404':
                try:
                    self.s3.create_bucket(Bucket=self.bucket_name)
                    print(f"✅ Bucket '{self.bucket_name}' успешно создан")
                except Exception as create_err:
                    print(f"⚠️ Не удалось создать бакет: {create_err}")
            else:
                print(f"⚠️ Ошибка проверки бакета: {e}")

        self.make_bucket_public()

    def upload_file(self, file_content: bytes, key: str, content_type: str = "application/octet-stream"):
        """Загрузка файла в MinIO с публичным доступом"""
        try:
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=file_content,
                ContentType=content_type,
                ACL='public-read'
            )
            print(f"✅ Uploaded publicly: {key}")
        except Exception as e:
            raise Exception(f"Upload failed: {e}")

    def delete_file(self, key: str):
        """Удаление файла из MinIO"""
        try:
            self.s3.delete_object(Bucket=self.bucket_name, Key=key)
            print(f"✅ Deleted: {key}")
        except Exception as e:
            raise Exception(f"Delete failed: {e}")

    def get_public_url(self, key: str) -> str:
        """Возвращает публичную ссылку для браузера"""
        if not key:
            return ""
        public_base = os.getenv("MINIO_PUBLIC_URL", "http://localhost:9000").rstrip('/')
        return f"{public_base}/{self.bucket_name}/{key}"

    def make_bucket_public(self):
        """Применяет политику публичного чтения ко всему бакету"""
        try:
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{self.bucket_name}/*"]
                    }
                ]
            }
            self.s3.put_bucket_policy(
                Bucket=self.bucket_name,
                Policy=json.dumps(policy)
            )
            print(f"✅ Bucket '{self.bucket_name}' is now public (policy applied)")
        except Exception as e:
            print(f"⚠️ Could not set public policy: {e}")


_s3_storage_instance = None

def get_s3_storage():
    global _s3_storage_instance
    if _s3_storage_instance is None:
        _s3_storage_instance = S3Storage()
    return _s3_storage_instance