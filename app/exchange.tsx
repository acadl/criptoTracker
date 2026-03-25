import { useEffect, useState } from 'react';
import {
  View, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getOrderBook, getRecentTrades } from '@/services/Binance';
import { Appbar } from "@/components/customs";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

const TOP_PAIRS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];

const TABS = [
  { key: 'pairs', label: 'Pares' },
  { key: 'orderbook', label: 'Livro de ofertas' },
  { key: 'trades', label: 'Negociações' },
];

export default function ExchangeModal() {
  const { exchangeName } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState('pairs');
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  
  type OrderBook = {
  bids: [string, string][];
  asks: [string, string][];
};
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (activeTab === 'orderbook' || activeTab === 'trades') {
      fetchData();
    }
  }, [activeTab, selectedPair]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'orderbook') {
        const data = await getOrderBook(selectedPair);
        setOrderBook(data);
      } else {
        const data = await getRecentTrades(selectedPair);
        setTrades(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header */}
      <View style={styles.header}>
        {/*<TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.back}>✕</ThemedText>
        </TouchableOpacity>*/}
        <ThemedText type="title" style={styles.title}>{exchangeName}</ThemedText>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { ...styles.tabActive, borderBottomColor: theme.colors.primary }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <ThemedText style={[styles.tabText, activeTab === tab.key && { ...styles.tabTextActive, color: theme.colors.primary }]}>
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seletor de par */}
      {activeTab !== 'pairs' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pairScroll} contentContainerStyle={{ 
          alignItems: 'center',
          height: 52,      // mesma altura aqui também
        }}>
          {TOP_PAIRS.map((pair) => (
            <TouchableOpacity
              key={pair}
              style={[
                styles.pairChip,
                selectedPair === pair && { ...styles.pairChipActive, backgroundColor: theme.colors.primary }
              ]}
              onPress={() => setSelectedPair(pair)}
            >
              <ThemedText style={[styles.pairChipText, selectedPair === pair && styles.pairChipTextActive]}>
                {pair}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Conteúdo */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={theme.colors.primary} size="large" />
      ) : (
        <>
          {/* Lista de Pares */}
          {activeTab === 'pairs' && (
            <FlatList
              data={TOP_PAIRS}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.pairList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pairRow}
                  onPress={() => { setSelectedPair(item); setActiveTab('orderbook'); }}
                >
                  <ThemedText style={styles.pairName}>{item.replace('USDT', '/USDT')}</ThemedText>
                  <ThemedText style={styles.pairArrow}>›</ThemedText>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Livro de Ofertas */}
          {activeTab === 'orderbook' && orderBook && (
            <ScrollView contentContainerStyle={styles.bookContainer}>
              <View style={styles.bookColumns}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.bookHeader, { color: '#16a34a' }]}>Compra</ThemedText>
                  {orderBook.bids.map(([price, qty], i) => (
                    <View key={i} style={styles.bookRow}>
                      <ThemedText style={styles.bookPrice}>{parseFloat(price).toFixed(2)}(usd)</ThemedText>
                      <ThemedText style={styles.bookQty}>{parseFloat(qty).toFixed(4)}(qtd)</ThemedText>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.bookHeader, { color: '#dc2626' }]}>Venda</ThemedText>
                  {orderBook.asks.map(([price, qty], i) => (
                    <View key={i} style={styles.bookRow}>
                      <ThemedText style={styles.bookPrice}>{parseFloat(price).toFixed(2)}(usd)</ThemedText>
                      <ThemedText style={styles.bookQty}>{parseFloat(qty).toFixed(4)}(qtd)</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}

          {/* Últimas Negociações */}
          {activeTab === 'trades' && (
            <FlatList
              data={trades}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <View style={styles.tradeRow}>
                  <ThemedText style={[styles.tradePrice, { color: item.isBuyerMaker ? '#dc2626' : '#16a34a' }]}>
                    {parseFloat(item.price).toFixed(2)} (usd)
                  </ThemedText>
                  <ThemedText style={styles.tradeQty}>{parseFloat(item.qty).toFixed(5)}(qtd)</ThemedText>
                  <ThemedText style={styles.tradeTime}>
                    {new Date(item.time).toLocaleTimeString('pt-BR')}
                  </ThemedText>
                </View>
              )}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  back: { fontSize: 20, width: 32 },
  title: { fontSize: 18, fontWeight: '700', color: '#888' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2 },
  tabText: { fontSize: 14, color: '#888' },
  tabTextActive: { fontWeight: '600' },
  pairScroll: {
    paddingHorizontal: 12,
    height: 52,        // altura fixa explícita
    flexShrink: 0,     // impede que seja comprimido
  },
    pairChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    minWidth: 90,           // largura mínima igual pra todos
    alignItems: 'center',
  },
  pairChipActive: {},
  pairChipTextActive: { color: '#fff', fontWeight: '600' },
  pairChipText: { fontSize: 13, color: '#555' },
  pairList: { padding: 16, gap: 10 },
  pairRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f9f9f9', borderRadius: 10, padding: 14
  },
  pairName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#000000', },
  pairArrow: { fontSize: 20, color: '#999' },
  bookContainer: { padding: 16 },
  bookColumns: { flexDirection: 'row', gap: 8 },
  bookHeader: { fontSize: 13, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  bookRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  bookPrice: { fontSize: 12, color: '#888' },
  bookQty: { fontSize: 12, color: '#888' },
  tradeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  tradePrice: { fontSize: 13, fontWeight: '600', flex: 1 },
  tradeQty: { fontSize: 13, color: '#555', flex: 1, textAlign: 'center' },
  tradeTime: { fontSize: 12, color: '#999', flex: 1, textAlign: 'right' },
  safeArea: {
    flex: 1,
  }
});