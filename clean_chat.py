import json
import os

# Configuración de rutas
input_file_path = r'C:\Users\facun\Desktop\optimizar json chat aistudio\dafre\- Da Fre_17-12-2025.json'
output_file_path = r'c:\Users\facun\Desktop\optimizar json chat aistudio\chat_optimizado.json'

def clean_json():
    if not os.path.exists(input_file_path):
        print(f"Error: No se encuentra el archivo {input_file_path}")
        return

    try:
        with open(input_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("Archivo cargado correctamente.")
        
        # Verificar estructura
        if 'chunkedPrompt' not in data or 'chunks' not in data['chunkedPrompt']:
            print("El formato del JSON no es el esperado (no se encontró chunkedPrompt.chunks).")
            return

        original_chunks = data['chunkedPrompt']['chunks']
        cleaned_chunks = []
        
        print(f"Procesando {len(original_chunks)} chunks...")
        
        for chunk in original_chunks:
            # Filtrar pensamientos (thinking chains)
            if chunk.get('isThought'):
                continue
            
            # Crear nuevo objeto limpio solo con role y text
            new_chunk = {
                'role': chunk.get('role'),
                'text': chunk.get('text')
            }
            
            cleaned_chunks.append(new_chunk)
            
        # Actualizar la lista de chunks en la estructura original
        # Opcional: Si quieres eliminar runSettings y systemInstruction, descomenta la siguiente línea y ajusta la estructura de salida
        # data = cleaned_chunks 
        
        # Mantenemos la estructura pero reemplazamos los chunks
        data['chunkedPrompt']['chunks'] = cleaned_chunks
        
        # Guardar el nuevo archivo
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"Proceso completado. Archivo guardado en: {output_file_path}")
        print(f"Chunks originales: {len(original_chunks)}")
        print(f"Chunks limpios: {len(cleaned_chunks)}")

    except Exception as e:
        print(f"Ocurrió un error: {e}")

if __name__ == "__main__":
    clean_json()
